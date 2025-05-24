import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useLoader, useThree, useFrame as useFrameGlobal } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// Importaciones para el efecto de contorno
import { EffectComposer, Outline, Selection, Select } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// Componente personalizado para los controles que vuelven a la posición original
function AnimatedControls() {
  const controlsRef = useRef<any>();
  const { camera } = useThree();
  const [lastInteraction, setLastInteraction] = React.useState(0);
  const [isUserInteracting, setIsUserInteracting] = React.useState(false);

  // Valores iniciales para restaurar la vista - se actualizarán cuando los controles estén listos
  const initialRotation = useRef({ 
    polarAngle: Math.PI / 3,  // Valor predeterminado, se actualizará con la posición real
    azimuthalAngle: Math.PI / 4  // Valor predeterminado, se actualizará con la posición real
  });

  // Detector de interacción
  const handleInteractionStart = () => {
    setIsUserInteracting(true);
    // Detiene la rotación automática mientras el usuario interactúa
    if (controlsRef.current) {
      controlsRef.current.autoRotate = false;
    }
  };

  const handleInteractionEnd = () => {
    setLastInteraction(Date.now());
    setIsUserInteracting(false);
  };

  // Monitorea si ha pasado tiempo suficiente desde la última interacción
  useFrameGlobal(() => {
    if (!isUserInteracting && lastInteraction > 0 && Date.now() - lastInteraction > 3000) {
      // Han pasado 3 segundos desde la última interacción, vuelve a la posición original
      if (controlsRef.current) {
        // Interpola suavemente hacia la posición original
        const controls = controlsRef.current;
        
        // Restablece la rotación para que vuelva a la original gradualmente
        if (Math.abs(controls.getPolarAngle() - initialRotation.current.polarAngle) > 0.01) {
          controls.setPolarAngle(THREE.MathUtils.lerp(
            controls.getPolarAngle(), 
            initialRotation.current.polarAngle,
            0.05
          ));
        }
        
        if (Math.abs(controls.getAzimuthalAngle() - initialRotation.current.azimuthalAngle) > 0.01) {
          controls.setAzimuthalAngle(THREE.MathUtils.lerp(
            controls.getAzimuthalAngle(), 
            initialRotation.current.azimuthalAngle,
            0.05
          ));
        }
        
        // Si estamos lo suficientemente cerca de la posición original, reinicia la rotación automática
        if (
          Math.abs(controls.getPolarAngle() - initialRotation.current.polarAngle) < 0.1 &&
          Math.abs(controls.getAzimuthalAngle() - initialRotation.current.azimuthalAngle) < 0.1
        ) {
          controls.autoRotate = true;
          setLastInteraction(0); // Reinicia el temporizador
        }
      }
    }
  });
  // Cuando se monta el componente, configura los eventos
  useEffect(() => {
    if (!controlsRef.current) return;
    
    const controls = controlsRef.current;
    
    // Captura los valores iniciales de rotación después de que el componente se monte completamente
    // y el modelo esté en la posición deseada
    // Lo hacemos con un pequeño retraso para asegurar que todo está listo
    const timer = setTimeout(() => {
      if (controlsRef.current) {
        initialRotation.current = {
          polarAngle: controls.getPolarAngle(),
          azimuthalAngle: controls.getAzimuthalAngle()
        };
        console.log('Posición inicial capturada:', initialRotation.current);
      }
    }, 100);
    
    const domElement = controls.domElement;
    
    // Añade event listeners para detectar cuando el usuario interactúa
    domElement.addEventListener('pointerdown', handleInteractionStart);
    domElement.addEventListener('pointerup', handleInteractionEnd);
    // También detectamos cuando el usuario mueve el mouse fuera del elemento
    domElement.addEventListener('pointerout', handleInteractionEnd);
    // Y cuando completa un gesto táctil o de rueda
    domElement.addEventListener('wheel', () => {
      handleInteractionStart();
      setTimeout(handleInteractionEnd, 250); // Pequeño retraso para simular el fin de la interacción
    }, { passive: true });
    
    return () => {
      // Limpia los event listeners y el timer
      clearTimeout(timer);
      domElement.removeEventListener('pointerdown', handleInteractionStart);
      domElement.removeEventListener('pointerup', handleInteractionEnd);
      domElement.removeEventListener('pointerout', handleInteractionEnd);
      domElement.removeEventListener('wheel', () => {});
    };
  }, []); // Ejecutamos el efecto solo cuando el componente se monta
  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={false} 
      enableZoom={false}
      minPolarAngle={Math.PI / 8}
      maxPolarAngle={Math.PI / 1.8}
      autoRotate={true} // Comienza con autorotación
      autoRotateSpeed={1.5}
      enableDamping={true}
      dampingFactor={0.05}
      makeDefault
      // Configuramos los valores iniciales
      position={[0, 0, 4.5]}
    />
  );
}

function InkfinityModel(props: any) {
  const modelRef = useRef<THREE.Object3D>();
  // Material blanco para aplicar al modelo
  const whiteMaterial = new THREE.MeshBasicMaterial({ 
    color: new THREE.Color(1, 1, 1), // Color blanco puro
    transparent: true,
    opacity: 1
  });

  // Hook para cargar el modelo GLB (debe estar fuera de condicionales)
  const gltf = useGLTF('/3d-models/Personaje Inkfinity.glb', true);

  // Añadir animación suave
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.7) * 0.1;
    }
  });

  // Aplicar material blanco a todo el modelo
  React.useEffect(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = whiteMaterial;
        }
      });
    }
    // Llama al callback de carga si existe
    if (props.onLoad && gltf) {
      props.onLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf]);

  if (gltf && gltf.scene) {
    return (
      <Selection>
        <Select enabled>
          <primitive ref={modelRef} object={gltf.scene} {...props} />
        </Select>
      </Selection>
    );
  }
  // Si no hay modelo, no renderizamos nada
  return null;
}

// Precargar el modelo
try {
  useGLTF.preload('/3d-models/Personaje Inkfinity.glb');
} catch (error) {
  console.error("Error precargando el modelo:", error);
}

export default function ThreeDModel() {
  // Referencia al contenedor para obtener dimensiones
  const containerRef = useRef<HTMLDivElement>(null);
  // Referencia al canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Estado para controlar si hubo error y para manejar la carga
  const [loadError, setLoadError] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  // Efecto para manejar el redimensionamiento
  useEffect(() => {
    // Handler para redimensionar el canvas cuando cambia el tamaño de la ventana
    const handleResize = () => {
      if (containerRef.current) {
        // Forzar re-render cuando cambia el tamaño
        containerRef.current.style.display = 'none';
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.display = 'block';
          }
        }, 0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleError = () => {
    console.error("Error cargando el componente Three.js");
    setLoadError(true);
  }
  
  // Función para manejar cuando el modelo se ha cargado
  const handleModelLoaded = () => {
    setLoaded(true);
  }

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '50%',
        height: '50%',
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'transparent',
        pointerEvents: 'auto'  // Habilitamos las interacciones para permitir mover el modelo
      }}
    >
      {loadError ? (
        <div className="flex items-center justify-center w-full h-full text-white">
          Error al cargar el modelo 3D. Por favor, verifica que el archivo exista en /public/3d-models/
        </div>
      ) : (
        <ErrorBoundary onError={handleError}>
          <Canvas
            ref={canvasRef}
            camera={{ position: [0, 0, 4.5], fov: 35 }} 
            style={{ 
              background: 'transparent', 
              display: 'block', 
              borderRadius: '0',
              pointerEvents: 'auto' // Habilitamos las interacciones
            }}
            gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
          >
            <scene background={null} />
            {/* No necesitamos luces para MeshBasicMaterial ya que no responde a la iluminación */}
            <Suspense fallback={null}>
              <InkfinityModel 
                scale={1}  // Más pequeño para que no tenga tanto zoom
                position={[0, -0.3, 0]}  // Posición más arriba
                rotation={[0, Math.PI / 4, 0]} 
                onLoad={handleModelLoaded}
              />
            </Suspense>
            <AnimatedControls />
          </Canvas>
        </ErrorBoundary>
      )}
      {!loaded && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
          Cargando modelo 3D...
        </div>
      )}
    </div>
  );
}

// Componente para manejar errores en React
class ErrorBoundary extends React.Component<{children: React.ReactNode, onError: () => void}> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: any) {
    console.error("Error en el componente Three.js:", error);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

// Necesario para que Next.js no intente renderizar en SSR
// eslint-disable-next-line
export { InkfinityModel };
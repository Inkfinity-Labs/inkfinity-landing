# Inkfinity Landing Page

A modern, responsive landing page for Inkfinity built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- 🌐 Internationalization (i18n) support for English and Spanish
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🎯 SEO optimized
- 🚀 Built with Next.js for optimal performance

## Tech Stack

- React (with TypeScript)
- Next.js
- Tailwind CSS
- shadcn/ui components
- Framer Motion
- next-i18next

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/inkfinity-landing.git
cd inkfinity-landing
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Features.tsx
│   │   └── Community.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── dropdown-menu.tsx
├── lib/
│   └── utils.ts
├── pages/
│   └── index.tsx
└── styles/
    └── globals.css
```

## Internationalization

The landing page supports both English and Spanish languages. Translations are stored in the `public/locales` directory:

- `public/locales/en/common.json` - English translations
- `public/locales/es/common.json` - Spanish translations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
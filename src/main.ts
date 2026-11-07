import { createApp } from 'vue';
import App from './App.vue';
import { registerFonts } from './fonts/registry';
import { ALL_MOCK_CSS } from './platforms';
import { SHOT_BASE_CSS } from './stage/shot';
import './styles/app.css';

// Dismisses the "Powered by Netlify" badge, as in the other projects. Storage can be blocked, and
// that must not stop the app from starting. This flag is the only thing the site ever writes to
// the browser, and it holds nothing the visitor typed or picked.
try {
  localStorage.setItem('nl-hud:public:v1', 'true');
} catch {
  // The badge stays; nothing else depends on it.
}

registerFonts();

// The mock stylesheets as one <style>: the same text the exporter packs into every image, so the
// preview and the PNG cannot drift apart.
const style = document.createElement('style');
style.id = 'mock-css';
style.textContent = `${SHOT_BASE_CSS}\n${ALL_MOCK_CSS}`;
document.head.appendChild(style);

createApp(App).mount('#app');

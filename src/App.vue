
  <template>
    <router-view />
  </template>

  <script>
  export default {
    name: 'App'
  }
  </script>

<style scoped>
body, .v-application {
  min-height: 100vh;
  background:
    linear-gradient(180deg, #e3f0ff 0%, #b3cfff 100%) fixed,
    url('data:image/svg+xml;utf8,<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="16" height="16" fill="%23dbeafe"/><rect x="16" y="16" width="16" height="16" fill="%23dbeafe"/></svg>') repeat;
  background-size: auto, 64px 64px;
}
.gba-app-bar {
  background: linear-gradient(180deg, #18315b 0%, #254e8e 100%) !important;
  border-bottom: 6px solid #FFD600;
  box-shadow: 0 4px 24px #18315b33;
  position: relative;
}
.gba-title {
  font-family: 'Press Start 2P', 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
  font-weight: 900;
  letter-spacing: 2.5px;
  font-size: 2.3rem;
  color: #FFD600;
  text-shadow: 2px 2px 0 #18315b, 0 0 8px #fff;
  display: flex;
  align-items: center;
}
.gba-title-text {
  color: #FFD600;
  text-shadow: 2px 2px 0 #18315b, 0 0 8px #fff;
  font-family: 'Press Start 2P', 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
}
.gba-menu-btn, .gba-search-btn {
  animation: poke-bounce 2.2s infinite cubic-bezier(.68,-0.55,.27,1.55);
}
.gba-menu-btn:hover, .gba-search-btn:hover {
  animation: poke-bounce-hover 0.4s 1 cubic-bezier(.68,-0.55,.27,1.55);
}
.gba-menu-btn {
  background: #FFD600 !important;
  color: #18315b !important;
  border-radius: 8px;
  margin-left: 6px;
  margin-right: 6px;
  font-weight: 900;
  font-family: 'Press Start 2P', 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
  border: 3px solid #D32F2F;
  box-shadow: 0 2px 0 #000;
  transition: background 0.2s, box-shadow 0.2s, color 0.2s;
  text-shadow: 1px 1px 0 #fff;
}
.gba-menu-btn:hover {
  background: #fff200 !important;
  color: #D32F2F !important;
  box-shadow: 0 2px 8px #FFD60066;
  border-color: #18315b;
}
.gba-search-btn {
  background: #FFD600 !important;
  color: #18315b !important;
  border-radius: 8px;
  font-weight: 900;
  letter-spacing: 1px;
  font-family: 'Press Start 2P', 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
  border: 3px solid #D32F2F;
  box-shadow: 0 2px 0 #000;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s, color 0.2s;
  text-shadow: 1px 1px 0 #fff;
}
.gba-search-btn:hover {
  background: #fff200 !important;
  color: #D32F2F !important;
  transform: scale(1.07);
  box-shadow: 0 4px 24px #FFD60066;
  border-color: #18315b;
}
.gba-type-chip {
  border-radius: 8px !important;
  font-weight: bold;
  border: 2.5px solid #111 !important;
  color: #fff !important;
  font-family: 'Press Start 2P', 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif;
  text-shadow: 1px 1px 0 #000;
  box-shadow: 0 2px 8px #0002;
  animation: poke-bounce 2.8s infinite cubic-bezier(.68,-0.55,.27,1.55);
}
.v-chip.gba-type-chip, .v-chip.gba-type-chip * {
  color: #fff !important;
  border: 2.5px solid #111 !important;
  font-family: 'Press Start 2P', 'VT323', 'Fira Mono', 'monospace', Arial, sans-serif !important;
  text-shadow: 1px 1px 0 #000;
}
.gba-main-card {
  border-radius: 18px !important;
  background: #fff !important;
  box-shadow: 0 8px 32px #18315b22 !important;
  border: 4px solid #18315b !important;
  padding: 32px 24px !important;
  margin-bottom: 32px !important;
}
.v-card {
  border-radius: 18px !important;
  background: #fff !important;
  box-shadow: 0 8px 32px #18315b22 !important;
  border: 3px solid #18315b !important;
  padding: 24px 16px !important;
  margin-bottom: 36px !important;
  padding-bottom: 32px !important;
}
.v-container, .v-main {
  padding-top: 32px !important;
  padding-bottom: 32px !important;
}
@keyframes poke-bounce {
  0%, 100% { transform: translateY(0); }
  10% { transform: translateY(-2px); }
  20% { transform: translateY(-6px); }
  30% { transform: translateY(-2px); }
  40% { transform: translateY(0); }
}
@keyframes poke-bounce-hover {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}
</style>
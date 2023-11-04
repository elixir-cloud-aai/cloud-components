<script setup>
import { useSidebar } from "vitepress/theme";
import { useData } from "vitepress";

const { hasSidebar } = useSidebar();
const { isDark } = useData();
</script>

<template>
  <footer class="footer" v-if="!hasSidebar">
    <div class="container">
      <div class="footer-icons">
        <a
          href="https://elixir-cloud.dcc.sib.swiss/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            :src="isDark ? '/elixir-cloud/logo.svg' : '/elixir-cloud/logo.svg'"
            alt="Elixir Cloud & AAI"
            class="footer-logo"
          />
        </a>
        <img
          :src="isDark ? '/cloud-sdk/dark.svg' : '/cloud-sdk/light.svg'"
          alt="Cloud SDK"
          class="footer-logo"
        />
        <a
          href="https://elixir-europe.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            :src="isDark ? '/elixir/dark.png' : '/elixir/light.svg'"
            alt="Elixir"
            class="footer-logo"
          />
        </a>
      </div>
      <div class="footer-content">
        <p class="message">Released under the MIT License</p>
        <p class="copyright">Copyright © 2023-present Elixir</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid rgb(56, 56, 56);
  padding-top: 32px;
  padding-bottom: 32px;
}
/* give padding on bigger screens */
@media (min-width: 768px) {
  .footer {
    padding-left: 72px;
    padding-right: 72px;
  }
}

.container {
  margin: 0 auto;
  text-align: center;
  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .container {
    gap: 24px;
    flex-direction: column;
  }
}

.message,
.copyright {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.footer-icons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

.footer-logo {
  height: 72px;
}
</style>

<!-- <script>
export default {
  name: "Footer",
};
</script> -->

<!-- components/DogBreedGallery.vue -->
<template>
  <div>
    <h2>{{ selectedBreed }}</h2>
    <button @click="loadImages">Load Images</button>
    <div v-if="images.length > 0">
      <div v-for="image in images" :key="image.id" class="image-container">
        <img :src="image.url" :alt="'Dog ' + image.id" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedBreed: String,
  },
  data() {
    return {
      images: [],
    };
  },
  methods: {
    async loadImages() {
      try {
        const response = await this.$axios.$get(
          `images/search?breed_ids=${this.selectedBreed}&limit=10`
        );
        this.images = response.data;
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Add your component styles here */
.image-container {
  margin: 10px;
}
</style>

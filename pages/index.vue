<template>
  <header
    class="bg-gray-500"
    style="
      height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 30px;
    ">
    <h1 style="font-size: 24px; color: white">
      Welcome to the gallery of dogs.
    </h1>
  </header>
  <div class="container mx-auto">
    <div class="flex justify-center mb-5">
      <Listbox as="div" v-model="selected">
        <ListboxLabel class="block text-sm font-medium leading-6 text-gray-900"
          >Select a dog breed you would like to have a look</ListboxLabel
        >
        <div class="relative">
          <ListboxButton
            class="relative w-100 cursor-default rounded-md bg-white py-1.5 pl-4 pr-40 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
            <span class="inline-flex w-full truncate">
              <span class="ml-2 truncate text-gray-500">{{
                selected.breedName
              }}</span>
            </span>
            <span
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                class="h-5 w-5 text-gray-400"
                aria-hidden="true" />
            </span>
          </ListboxButton>

          <transition
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <ListboxOptions
              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption
                as="template"
                v-for="dogs in dogsList"
                :key="dogs.breedName"
                :value="dogs"
                v-slot="{ active, selected }">
                <li
                  :class="[
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                  ]"
                  @click="fetchDogs(dogs.breedName)">
                  <div class="flex">
                    <span
                      :class="[
                        selected ? 'font-semibold' : 'font-normal',
                        'truncate',
                      ]"
                      >{{ dogs.breedName }}</span
                    >
                    <!-- <span :class="[active ? 'text-indigo-200' : 'text-gray-500', 'ml-2 truncate']">{{ dogs.dogBreedName }}</span> -->
                  </div>

                  <span
                    v-if="selected"
                    :class="[
                      active ? 'text-white' : 'text-indigo-600',
                      'absolute inset-y-0 right-0 flex items-center pr-4',
                    ]">
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
    </div>
    <h1>Scroll down to have a look at all dog breeds you have picked.</h1>
    <div
      v-for="(item, index) in selectedList"
      :key="index"
      class="center relative inline-block select-none whitespace-nowrap rounded-lg bg-gray-400 py-2 px-3.5 align-baseline font-sans text-xs font-bold uppercase leading-none text-white"
      style="margin: 8px">
      {{ item }}
    </div>

    <div class="-m-1 flex flex-wrap md:-m-2">
      <!-- Outer loop to iterate over multiple arrays -->
      <div
        v-for="(imageUrlsArray, arrayIndex) in imageUrlsList"
        :key="arrayIndex"
        class="w-full">
        <div
          class="bg-gray-400"
          style="
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
          ">
          <h1 style="font-size: 24px; color: white" class="capitalize">
            {{ selectedList[arrayIndex] }}
          </h1>
        </div>

        <!-- Inner loop to iterate over image URLs within each array -->
        <div class="bg-gray-400 flex flex-wrap">
          <div
            v-for="(imageUrl, index) in imageUrlsArray"
            :key="index"
            class="w-1/4 p-1 md:p-2"
            style="width: 25%">
            <div class="relative" style="width: 100%; height: 300px">
              <div class="rounded-lg p-4 h-full">
                <img
                  alt="gallery"
                  class="absolute inset-0 h-full w-full rounded-lg object-cover object-center"
                  :src="imageUrl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

onMounted(() => {
  fetchDogsList();
  fetchDogs("airedale");
});

const imageUrlsList = ref([]);
const imageUrlsArray = ref([]);
const dogsList = ref([]);
const count = ref();

const selected = ref({ breedName: "airedale", dogBreedName: "@affenpinscher" });
const selectedList = ref([]);

async function fetchDogsList() {
  const response = await fetch("https://dog.ceo/api/breeds/list/all");
  const data = await response.json();
  const dataObject = Object.keys(data.message);
  dogsList.value = Object.keys(data.message).map((breed) => {
    const breedName = breed;
    const dogBreedName = `@${breed}`;
    return { breedName, dogBreedName };
  });

  console.log(dogsList.value[0]);
}

async function fetchDogs(breed) {
  console.log("Fetch Dogs--------", breed);
  selectedList.value.push(breed);

  console.log("Fetch Dogs selectedList--------", selectedList.value);

  await fetch(`https://dog.ceo/api/breed/${breed}/images/random/20`)
    .then((response) => {
      if (response.status === 301) {
        const newURL = response.headers.get("Location");
        return fetch(newURL);
      } else {
        return response.json();
      }
    })
    .then((jsonData) => {
      console.log("jsonData.message", jsonData.message);
      imageUrlsList.value.push(jsonData.message);
      imageUrlsArray.value = jsonData.message;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  console.log("imageUrlsList.value=====================", imageUrlsList.value);
}
</script>

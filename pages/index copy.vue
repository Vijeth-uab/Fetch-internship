<template>
  <header
    class="bg-gray-500"
    style="
      height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
    ">
    <h1 style="font-size: 24px; color: white">
      Welcome to the gallery of dogs.
    </h1>
  </header>
  <div class="container mx-auto">
    <div class="flex justify-center mb-5">
      <Listbox as="div" v-model="selected">
        <ListboxLabel class="block text-sm font-medium leading-6 text-gray-900"
          >Select dog breed</ListboxLabel
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

    <div class="flex justify-center mb-10 capitalize">
      <h1>
        <b>{{ selected.breedName }}</b> breed's images are displayed
      </h1>
    </div>
    <div class="-m-1 flex flex-wrap md:-m-2">
      <div
        class="flex w-1/4 flex-wrap"
        v-for="(imageUrl, index) in imageUrlsArray"
        :key="index">
        <div class="w-full p-1 md:p-2">
          <img
            alt="gallery"
            class="block h-full w-full rounded-lg object-cover object-center"
            :src="imageUrl"
            style="max-width: 300px; max-height: 300px" />
        </div>
      </div>
      <h1>First section ends here</h1>
      <div
        class="flex w-1/4 flex-wrap"
        v-for="(imageUrl, index) in imageUrlsArray"
        :key="index">
        <div class="w-full p-1 md:p-2">
          <img
            alt="gallery"
            class="block h-full w-full rounded-lg object-cover object-center"
            :src="imageUrl"
            style="max-width: 300px; max-height: 300px" />
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

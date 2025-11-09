<script setup></script>


<template>
    <aside class="h-screen bg-zinc-800">
                <div class="bg-white p-8 rounded-lg shadow-lg">
                    <h2 class="text-xl font-bold mb-4">Basic Modal</h2>
                    <p>This is a very basic modal content.</p>
                    <button @click="toggleModal" class="mt-4 bg-red-500 py-2 px-4 rounded hover:bg-red-700 text-white">
                        Close Modal
                    </button>
                </div>
    </aside>
</template>
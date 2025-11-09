<script setup>
defineProps({
  name: String,
})      
</script>
<template>
  <div class="max-w-[90px] overflow-x-hidden flex flex-col items-center gap-2">
    <div class="min-w-10 h-full rounded-full overflow-hidden">
      <img src="https://placehold.co/40x40" alt="" />
    </div>
    
    <p class="w-full whitespace-nowrap overflow-x-hidden text-ellipsis text-center">
      {{ name }}
    </p>
    
  </div>
</template>

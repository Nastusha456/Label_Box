<template>
  <div class="palette">
    <input
      type="radio"
      id="white"
      name="palette"
      value="white"
      @input="changeColor"
    />
    <input
      type="radio"
      id="blue"
      name="palette"
      value="blue"
      @input="changeColor"
    />
    <input
      type="radio"
      id="red"
      name="palette"
      value="red"
      @input="changeColor"
      checked
    />
    <input
      type="radio"
      id="yellow"
      name="palette"
      value="yellow"
      @input="changeColor"
    />
    <input
      type="radio"
      id="green"
      name="palette"
      value="green"
      @input="changeColor"
    />
  </div>
</template>

<script>
export default {
  methods: {
    changeColor(event) {
      this.$emit("changeColor", event.target._value)
    },
  },
}
</script>

<style scoped>
.palette {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}

.palette input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  border-radius: 50%;
  width: 13px;
  height: 13px;

  border: 2px solid rgba(255, 255, 255, 0.5);
  margin-right: 3px;

  position: relative;
}

#white:checked {
  color: white;
  background-color: white;
  border-color: rgba(255, 255, 255, 0.1);
}

#white {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
}
#blue:checked {
  color: blue;
  background-color: blue;
  border-color: rgba(255, 255, 255, 0.1);
}

#blue {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: blue;
}

#red:checked {
  color: red;
  background-color: red;
  border-color: rgba(255, 255, 255, 0.1);
}

#red {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: red;
}

#yellow:checked {
  color: yellow;
  background-color: yellow;
  border-color: rgba(255, 255, 255, 0.1);
}

#yellow {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: yellow;
}

#green:checked {
  color: green;
  background-color: green;
  border-color: rgba(255, 255, 255, 0.1);
}

#green {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: green;
}
</style>

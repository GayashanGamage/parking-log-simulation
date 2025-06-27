<template>
  <!-- main parking land -->
  <div class="flex flex-col justify-center items-center border w-full h-screen bg-amber-100 px-4">
    <h1 class="text-xl uppercase font-black">Parking Area</h1>
    <!-- parking area -->
    <div class="grid grid-cols-2 gap-4 w-full h-atuo p-4">
      <!-- Electric vehicle section -->
      <div class="flex flex-col gap-6">
        <h4 class="text-center font-black uppercase text-gray-600">Electric vehicle section</h4>
        <div class="flex flex-row gap-4">
          <div class="flex flex-col gap-2 border p-4 w-full rounded-sm" v-for="item, parkingIndex in electricSection">
            <h3 class=""><span class="text-xs">Slot name </span><span
                class=" bg-black text-white py-1 px-2 rounded-full font-bold">{{
                  item.id
                }}</span>
            </h3>
            <p class="text-xs">Sensors</p>
            <hr>
            <div class="flex flex-col gap-1" v-for="i, sensorIndex in item.Sensors">
              <p class="font-bold capitalize">{{ i.name }}</p>
              <button class="py-1 px-2 rounded-sm text-white"
                :class="{ 'bg-green-600': i.status == true, 'bg-red-500': i.status == false }"
                @click="changeSensorStatus(i.id, i.status, 'electricSection', parkingIndex, sensorIndex)"><span
                  class="text-xs">status
                </span>{{ i.status ==
                  true ?
                  'On'
                  : 'Off' }}
              </button>
              <div class="flex flex-col gap-1">
                <div class="flex flex-row gap-2">
                  <p class="">battery :</p>
                  <input type="text" class="border w-12 rounded-sm pl-1" :value="i.battery">
                </div>
                <p>{{ item }}</p>
                <button class="text-xs rounded-sm bg-orange-300"
                  @click="changeSensorBattery(i.id, i.battery, 'electricSection', parkingIndex, sensorIndex)">update</button>
              </div>
              <hr class="my-2">
            </div>
            <button class="py-1 px-2 rounded-sm text-white uppercase"
              :class="{ 'bg-green-600': item.Sensors[0].triggered == true && item.Sensors[1].triggered == true, 'bg-red-500': item.Sensors[0].triggered == false && item.Sensors[1].triggered == false }"
              @click="changeTrigger(item.Sensors[0].id, item.Sensors[1].id, item.Sensors[0].triggered, 'electricSection', parkingIndex, sensorIndex)"><span
                class="text-xs">triggered
                ? </span>{{
                  item.Sensors[0].triggered ==
                    false && item.Sensors[1].triggered == false ? 'no' :
                    'yes' }}</button>
          </div>
        </div>
      </div>
      <!-- Disability vehicle section -->
      <!-- <div class="flex flex-row gap-4 border p-4">
        <div class="border p-4 w-full" v-for="item in disabilitySection">

        </div>
      </div> -->

      <!-- privet vehicle section -->
      <!-- <div class="flex flex-row gap-4 border p-4 col-span-2">
        <div class="border p-4 w-full" v-for="item in privetSection">

        </div>
      </div> -->

      <!-- public vehicle section -->
      <!-- <div class="flex flex-row gap-4 border p-4 col-span-2">
        <div class="border p-4 w-full" v-for="item in publicSection">

        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
// import { getSensorData } from '@/service/database';
import { getJoinedSensorData, updateSensorStatus, updateSensorTrigger } from '@/service/database';
import { onBeforeMount, ref } from 'vue';

const electricSection = ref([])
const disabilitySection = ref([])
const privetSection = ref([])
const publicSection = ref([])

// get joint data
const getSensorData = async () => {
  const { data, error } = await getJoinedSensorData()
  for (let i = 0; i < data.length; i++) {
    if (data[i].id.slice(0, 1) == 'E') {
      electricSection.value.push(data[i])
    } else if (data[i].id.slice(0, 1) == 'D') {
      disabilitySection.value.push(data[i])
    } else if (data[i].id.slice(0, 1) == 'P') {
      privetSection.value.push(data[i])
    } else if (data[i].id.slice(0, 1) == 'A') {
      publicSection.value.push(data[i])
    }
  }
  console.log(electricSection.value.length)
}

onBeforeMount(async () => {
  // const { Sensors, error } = await getSensorData()   //this is for just get the sensor data (without join)
  // for (let i = 0; i < Sensors.length; i++) {
  //   if (Sensors[i].name == 'ultrasonic') {
  //     console.log(Sensors[i])
  //   }
  // }
  // const { data, error } = await getJoinedSensorData()
  // for (let i = 0; i < data.length; i++) {
  //   if (data[i].id.slice(0, 1) == 'E') {
  //     electricSection.value.push(data[i])
  //   } else if (data[i].id.slice(0, 1) == 'D') {
  //     disabilitySection.value.push(data[i])
  //   } else if (data[i].id.slice(0, 1) == 'P') {
  //     privetSection.value.push(data[i])
  //   } else if (data[i].id.slice(0, 1) == 'A') {
  //     publicSection.value.push(data[i])
  //   }
  // }
  // console.log(electricSection.value.length)
  getSensorData()
}
)

// this is for change sensor status (on : still working | off : not working )
const changeSensorStatus = async (id, sensorStatus, category, categoryIndex, sensorIndex) => {
  const { data, error } = await updateSensorStatus(id, !sensorStatus)
  if (data != null) {
    if (category == 'electricSection') {
      electricSection.value[categoryIndex].Sensors[sensorIndex].status = !sensorStatus
    } else if (category == 'disabilitySection') {
      disabilitySection.value[categoryIndex].Sensors[sensorIndex].status = !sensorStatus
    } else if (category == 'privetSection') {
      privetSection.value[categoryIndex].Sensors[sensorIndex].status = !sensorStatus
    } else if (category = 'publicSection') {
      publicSection.value[categoryIndex].Sensors[sensorIndex].status = !sensorStatus
    }
  }
}

const changeSensorBattery = (id, statuss, electricSection, parkingIndex, sensorIndex) => {

}

const changeTrigger = async (idOne, idTwo, triggerStatus, category, categoryIndex) => {
  const { data, error } = await updateSensorTrigger(idOne, idTwo, triggerStatus)
  if (data != null) {
    if (category == 'electricSection') {
      electricSection.value[categoryIndex].Sensors[0].triggered = !triggerStatus
      electricSection.value[categoryIndex].Sensors[1].triggered = !triggerStatus
    } else if (category == 'disabilitySection') {
      electricSection.value[categoryIndex].Sensors[0].triggered = !triggerStatus
      electricSection.value[categoryIndex].Sensors[1].triggered = !triggerStatus
    } else if (category == 'privetSection') {
      electricSection.value[categoryIndex].Sensors[0].triggered = !triggerStatus
      electricSection.value[categoryIndex].Sensors[1].triggered = !triggerStatus
    } else if (category = 'publicSection') {
      electricSection.value[categoryIndex].Sensors[0].triggered = !triggerStatus
      electricSection.value[categoryIndex].Sensors[1].triggered = !triggerStatus
    }
  }
}

</script>
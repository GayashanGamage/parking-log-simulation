<template>
  <!-- main parking land -->
  <div class="flex flex-col justify-center items-center border w-full h-auto px-4 py-10">
    <h1 class="text-xl uppercase font-black">Smart parking MAP</h1>

    <!-- gate area -->
    <div class="flex flex-row justify-between w-full h-auto p-4 mb-20">

      <!-- open gate -->
      <div class="flex flex-col gap-2 border rounded-sm p-4 px-15 text-center">
        <h3 class="text-3xl uppercase font-bold pb-15">Entry gate</h3>
        <div class="flex flex-col gap-2 p-2 rounded-sm bg-amber-100 min-w-[260px]">
          <p class="text-xs">Inductive Loop sensor</p>
          <button class="py-3 rounded-sm animate-pulse bg-gray-300" v-if="dataLoding"></button>
          <button class="text-white rounded-sm"
            :class="{ 'bg-red-500': openGate.Sensors[0].triggered == false, 'bg-green-600': openGate.Sensors[0].triggered == true }"
            v-if="!dataLoding" @click="openGateToggle(openGate.Sensors[0].id, openGate.Sensors[0].triggered)">{{
              openGate.Sensors[0].triggered == false ?
                'Close' : 'Open' }}</button>
        </div>
        <div class="flex flex-col gap-2 p-2 rounded-sm bg-amber-100" v-if="entryGateLPR">
          <p class="text-xs">Licen plate detect sensor</p>
          <input type="text" class="border text-center" v-model="vehicleNumberPlate">
          <button class="py-1 rounded-sm bg-orange-300 hover:bg-orange-200" @click="checkVehicle">Check vehicle</button>
        </div>
        <!-- message showing functionality -->
        <div
          :class="{ 'flex flex-col gap-2 p-2 rounded-sm bg-amber-100': gateToggle == false, 'flex flex-col gap-2 p-2 rounded-sm bg-green-200': gateToggle == true }">
          <p class="text-xs" v-if="!gateToggle">Gate <span class="text-lg font-black">Close</span></p>
          <p v-if="entrySuccess">your slot is {{ servedSlot }}</p>
          <p v-if="entryDenied">sorry.. this vahicle plate is not available</p>
          <p v-if="outOfSpace">sorry.. Out of parking lots at this moment</p>
          <p class="text-xs" v-if="gateToggle">Gate <span class="text-lg font-black">Open</span></p>
        </div>
      </div>

      <!-- close gate -->
      <!-- <div class="flex flex-col gap-2 border rounded-sm p-4 px-15 text-center">
        <h3 class="text-3xl uppercase font-bold pb-15">Exit gate</h3>
        <div class="flex flex-col gap-2 p-2 rounded-sm bg-amber-100">
          <p class="text-xs">Gate <span class="text-lg font-black">Close</span></p>
        </div>
        <div class="flex flex-col gap-2 p-2 rounded-sm bg-amber-100">
          <p class="text-xs">Licen plate detect sensor</p>
          <input type="text" class="border">
          <button class="border">Check vehicle</button>
        </div>
        <div class="flex flex-col gap-2 p-2 rounded-sm bg-amber-100">
          <p class="text-xs">Inductive Loop sensor</p>
          <button class="border">on</button>
        </div>
      </div> -->
      <div class="flex flex-col gap-2 border rounded-sm p-4 px-15 text-center">
        <h3 class="text-3xl uppercase font-bold pb-15">Exite gate</h3>
        <div
          :class="{ 'flex flex-col gap-2 p-2 rounded-sm bg-amber-100': exiteGateToggle == false, 'flex flex-col gap-2 p-2 rounded-sm bg-green-200': exiteGateToggle == true }">
          <p class="text-xs" v-if="!exiteGateToggle">Gate <span class="text-lg font-black">Close</span></p>
          <p v-if="exiteGateToggle">this vehicle is avaible</p>
          <p class="text-xs" v-if="exiteGateToggle">Gate <span class="text-lg font-black">Open</span></p>
        </div>
        <div class="flex flex-col gap-2 p-2 rounded-sm bg-amber-100" v-if="exiteGateLPR">
          <p class="text-xs">Licen plate detect sensor</p>
          <input type="text" class="border text-center" v-model="vehicleNumberPlate">
          <button class="py-1 rounded-sm bg-orange-300 hover:bg-orange-200" @click="checkVahicleExit">Check
            vehicle</button>
        </div>
        <div class="flex flex-col gap-2 p-2 rounded-sm bg-amber-100 min-w-[260px]">
          <p class="text-xs">Inductive Loop sensor</p>
          <button class="py-3 rounded-sm animate-pulse bg-gray-300" v-if="dataLoding"></button>
          <button class="text-white rounded-sm"
            :class="{ 'bg-red-500': closeGate.Sensors[0].triggered == false, 'bg-green-600': closeGate.Sensors[0].triggered == true }"
            v-if="!dataLoding" @click="closeGateToggle(closeGate.Sensors[0].id, closeGate.Sensors[0].triggered)">{{
              closeGate.Sensors[0].triggered == false ?
                'Close' : 'Open' }}</button>
        </div>
      </div>

    </div>

    <!-- parking area -->
    <div class="grid grid-cols-2 gap-4 w-full h-atuo p-4 ">
      <!-- Electric vehicle section -->
      <div class="flex flex-col gap-6 p-2 rounded-sm bg-amber-100">
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
              <div class="flex flex-col gap-1 border p-1 rounded-sm">
                <div class="flex flex-row gap-2">
                  <p class="">battery :</p>
                  <input type="text" class="border w-12 rounded-sm pl-1" v-model="i.battery">
                </div>
                <!-- <p>{{ item }}</p> -->
                <button class="text-xs rounded-sm bg-orange-300 hover:bg-orange-500"
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
      <div class="flex flex-col gap-6 p-2 rounded-sm bg-amber-100">
        <h4 class="text-center font-black uppercase text-gray-600">Disability vehicle section</h4>
        <div class="flex flex-row gap-4">
          <div class="flex flex-col gap-2 border p-4 w-full rounded-sm" v-for="item, parkingIndex in disabilitySection">
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
                @click="changeSensorStatus(i.id, i.status, 'disabilitySection', parkingIndex, sensorIndex)"><span
                  class="text-xs">status
                </span>{{ i.status ==
                  true ?
                  'On'
                  : 'Off' }}
              </button>
              <div class="flex flex-col gap-1 border p-1 rounded-sm">
                <div class="flex flex-row gap-2">
                  <p class="">battery :</p>
                  <input type="text" class="border w-12 rounded-sm pl-1" v-model="i.battery">
                </div>
                <!-- <p>{{ item }}</p> -->
                <button class="text-xs rounded-sm bg-orange-300 hover:bg-orange-500"
                  @click="changeSensorBattery(i.id, i.battery, 'disabilitySection', parkingIndex, sensorIndex)">update</button>
              </div>
              <hr class="my-2">
            </div>
            <button class="py-1 px-2 rounded-sm text-white uppercase"
              :class="{ 'bg-green-600': item.Sensors[0].triggered == true && item.Sensors[1].triggered == true, 'bg-red-500': item.Sensors[0].triggered == false && item.Sensors[1].triggered == false }"
              @click="changeTrigger(item.Sensors[0].id, item.Sensors[1].id, item.Sensors[0].triggered, 'disabilitySection', parkingIndex, sensorIndex)"><span
                class="text-xs">triggered
                ? </span>{{
                  item.Sensors[0].triggered ==
                    false && item.Sensors[1].triggered == false ? 'no' :
                    'yes' }}</button>
          </div>
        </div>
      </div>

      <!-- privet vehicle section -->
      <div class="flex flex-col gap-6 p-2 rounded-sm bg-amber-100 col-span-2">
        <h4 class="text-center font-black uppercase text-gray-600">Privet vehicle section</h4>
        <div class="flex flex-row gap-4">
          <div class="flex flex-col gap-2 border p-4 w-full rounded-sm" v-for="item, parkingIndex in privetSection">
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
                @click="changeSensorStatus(i.id, i.status, 'privetSection', parkingIndex, sensorIndex)"><span
                  class="text-xs">status
                </span>{{ i.status ==
                  true ?
                  'On'
                  : 'Off' }}
              </button>
              <div class="flex flex-col gap-1 border p-1 rounded-sm">
                <div class="flex flex-row gap-2">
                  <p class="">battery :</p>
                  <input type="text" class="border w-12 rounded-sm pl-1" v-model="i.battery">
                </div>
                <!-- <p>{{ item }}</p> -->
                <button class="text-xs rounded-sm bg-orange-300 hover:bg-orange-500"
                  @click="changeSensorBattery(i.id, i.battery, 'privetSection', parkingIndex, sensorIndex)">update</button>
              </div>
              <hr class="my-2">
            </div>
            <button class="py-1 px-2 rounded-sm text-white uppercase"
              :class="{ 'bg-green-600': item.Sensors[0].triggered == true && item.Sensors[1].triggered == true, 'bg-red-500': item.Sensors[0].triggered == false && item.Sensors[1].triggered == false }"
              @click="changeTrigger(item.Sensors[0].id, item.Sensors[1].id, item.Sensors[0].triggered, 'privetSection', parkingIndex, sensorIndex)"><span
                class="text-xs">triggered
                ? </span>{{
                  item.Sensors[0].triggered ==
                    false && item.Sensors[1].triggered == false ? 'no' :
                    'yes' }}</button>
          </div>
        </div>
      </div>
      <!-- public vehicle section -->
      <div class="flex flex-col gap-6 p-2 rounded-sm bg-amber-100 col-span-2">
        <h4 class="text-center font-black uppercase text-gray-600">public vehicle section</h4>
        <div class="flex flex-row gap-4">
          <div class="flex flex-col gap-2 border p-4 w-full rounded-sm" v-for="item, parkingIndex in publicSection">
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
                @click="changeSensorStatus(i.id, i.status, 'publicSection', parkingIndex, sensorIndex)"><span
                  class="text-xs">status
                </span>{{ i.status ==
                  true ?
                  'On'
                  : 'Off' }}
              </button>
              <div class="flex flex-col gap-1 border p-1 rounded-sm">
                <div class="flex flex-row gap-2">
                  <p class="">battery :</p>
                  <input type="text" class="border w-12 rounded-sm pl-1" v-model="i.battery">
                </div>
                <!-- <p>{{ item }}</p> -->
                <button class="text-xs rounded-sm bg-orange-300 hover:bg-orange-500"
                  @click="changeSensorBattery(i.id, i.battery, 'publicSection', parkingIndex, sensorIndex)">update</button>
              </div>
              <hr class="my-2">
            </div>
            <button class="py-1 px-2 rounded-sm text-white uppercase"
              :class="{ 'bg-green-600': item.Sensors[0].triggered == true && item.Sensors[1].triggered == true, 'bg-red-500': item.Sensors[0].triggered == false && item.Sensors[1].triggered == false }"
              @click="changeTrigger(item.Sensors[0].id, item.Sensors[1].id, item.Sensors[0].triggered, 'publicSection', parkingIndex, sensorIndex)"><span
                class="text-xs">triggered
                ? </span>{{
                  item.Sensors[0].triggered ==
                    false && item.Sensors[1].triggered == false ? 'no' :
                    'yes' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { getSensorData } from '@/service/database';
import { assignParkingLot, checkVehicleAvailability, gateToggleAction, getJoinedSensorData, updateBatteryStatus, updateSensorStatus, updateSensorTrigger } from '@/service/database';
import { onBeforeMount, ref } from 'vue';

const electricSection = ref([])
const disabilitySection = ref([])
const privetSection = ref([])
const publicSection = ref([])
const openGate = ref()
const closeGate = ref()

// gate related data
const entryGateLPR = ref(false)
const exiteGateLPR = ref(false)
const gateToggle = ref(false)
const exiteGateToggle = ref(false)

// gate message toggle functionality
const entrySuccess = ref(false)
const entryDenied = ref(false)
const outOfSpace = ref(false)
const servedSlot = ref(null)
const exitSuccess = ref(false)
const exitPay = ref(false)
const exitDenied = ref(false)

// skeleton animations
const dataLoding = ref(true)

// user input
const vehicleNumberPlate = ref('')

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
    } else if (data[i].id.slice(0, 2) == 'G1') {
      openGate.value = data[i]
    } else if (data[i].id.slice(0, 2) == 'G2') {
      closeGate.value = data[i]
    }
  }
  dataLoding.value = !dataLoding.value
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

const changeSensorBattery = async (id, statuss, category, parkingIndex, sensorIndex) => {
  if (isNaN(statuss) == true || Number(statuss) > 100 || Number(statuss) < 0) {
    statuss = 10
  }
  const { data, error } = await updateBatteryStatus(id, statuss)
  if (data != null) {
    if (category == 'electricSection') {
      electricSection.value[parkingIndex].Sensors[sensorIndex].battery = statuss
    } else if (category == 'disabilitySection') {
      disabilitySection.value[parkingIndex].Sensors[sensorIndex].battery = statuss
    } else if (category == 'privetSection') {
      privetSection.value[parkingIndex].Sensors[sensorIndex].battery = statuss
    } else if (category = 'publicSection') {
      publicSection.value[parkingIndex].Sensors[sensorIndex].battery = statuss
    }
  }
}

const changeTrigger = async (idOne, idTwo, triggerStatus, category, categoryIndex) => {
  // console.log(idOne, idTwo, triggerStatus, category, categoryIndex)
  const { data, error } = await updateSensorTrigger(idOne, idTwo, !triggerStatus)
  // console.log(data, error)
  if (data != null) {
    if (category == 'electricSection') {
      electricSection.value[categoryIndex].Sensors[0].triggered = !triggerStatus
      electricSection.value[categoryIndex].Sensors[1].triggered = !triggerStatus
    } else if (category == 'disabilitySection') {
      disabilitySection.value[categoryIndex].Sensors[0].triggered = !triggerStatus
      disabilitySection.value[categoryIndex].Sensors[1].triggered = !triggerStatus
    } else if (category == 'privetSection') {
      privetSection.value[categoryIndex].Sensors[0].triggered = !triggerStatus
      privetSection.value[categoryIndex].Sensors[1].triggered = !triggerStatus
    } else if (category = 'publicSection') {
      publicSection.value[categoryIndex].Sensors[0].triggered = !triggerStatus
      publicSection.value[categoryIndex].Sensors[1].triggered = !triggerStatus
    }
  }
}

const openGateToggle = async (id, value) => {
  const { data, error } = await gateToggleAction(id, !value)
  if (data != null) {
    openGate.value.Sensors[0].triggered = !value
    entryGateLPR.value = !entryGateLPR.value
  }
}

const closeGateToggle = async (id, value) => {
  const { data, error } = await gateToggleAction(id, !value)
  if (data != null) {
    closeGate.value.Sensors[0].triggered = !value
    exiteGateLPR.value = !exiteGateLPR.value
  }
}

const removeAllError = () => {
  entrySuccess.value = false
  entryDenied.value = false
  outOfSpace.value = false
  servedSlot.value = false
  exitSuccess.value = false
  exitPay.value = false
  exitDenied.value = false
}

// this is for check vehicle in 'ENTRY' gate
const checkVehicle = async () => {
  // remove all existing error messages on Entry and Exit gates
  removeAllError()
  const { data, error } = await checkVehicleAvailability(vehicleNumberPlate.value)
  if (data.length == 1) {
    const { slotData, error } = await assignParkingLot(data[0].vehicleType)
    if (slotData.length >= 1) {
      servedSlot.value = slotData[0].id
      entrySuccess.value = true
      gateToggle.value = true
    } else if (slotData.length == 0) {
      outOfSpace.value = true
      gateToggle.value = false
    }
  } else if (data.length == 0) {
    gateToggle.value = false
    entryDenied.value = true

  }
}

// this is for check vehicle in 'EXITE' gate
const checkVahicleExit = async () => {
  const { data, error } = await checkVehicleAvailability(vehicleNumberPlate.value)
  console.log(data, error)
  console.log(data.length)
  if (data.length == 1) {
    exiteGateToggle.value = true
  } else if (data.length == 0) {
    exiteGateToggle.value = false
  }
}

</script>
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getSensorData = async () => {
    let { data: Sensors, error } = await supabase
        .from('Sensors')
        .select('*')
    return {Sensors, error}
}

// database.js
export const getJoinedSensorData = async () => {
    // Initial joined query
    const { data, error } = await supabase
        .from('Slots')
        .select(`
            *,
            Sensors!slotid (
            id,
            name,
            status,
            battery,
            triggered
            )
        `)
    return {data, error}    
  // Realtime subscription for both tables
//   const channel = supabase
//     .channel('sensor-slot-updates')
//     .on(
//       'postgres_changes',
//       {
//         event: '*',
//         schema: 'public',
//         table: 'Sensors'
//       },
//       (payload) => handleUpdate(payload)
//     )
//     .on(
//       'postgres_changes',
//       {
//         event: '*',
//         schema: 'public',
//         table: 'Slots'
//       },
//       (payload) => handleUpdate(payload)
//     )
//     .subscribe()

//   return { data, error, channel }
}

export const updateSensorStatus = async (id, sensorStatus) => {
    const { data, error } = await supabase
        .from('Sensors')
        .update({ status : sensorStatus })
        .eq('id', id)
        .select()
    return {data, error}
}   

export const updateSensorTrigger = async (sensorOneId, sensorTwoId, sensorStatus) => {
    const { data, error } = await supabase
        .from('Sensors')
        .update({ triggered : sensorStatus })
        .in('id' , [sensorOneId, sensorTwoId])
        .select() 
    return {data, error}
}
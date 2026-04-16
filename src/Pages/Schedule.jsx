import React from "react"
import Senin from "../components/Mapel/Senin"
import Selasa from "../components/Mapel/Selasa"
import Rabu from "../components/Mapel/Rabu"
import Kamis from "../components/Mapel/Kamis"
import Jumat from "../components/Mapel/Jumat"

const Schedule = () => {
  const currentDayIndex = new Date().getDay()
  const currentDay = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ][currentDayIndex]

  const dayComponents = [null, <Senin />, <Selasa />, <Rabu />, <Kamis />, <Jumat />]
  const TodayComponent = dayComponents[currentDayIndex]

  console.log("Hari saat ini:", currentDay)
  console.log("Index hari:", currentDayIndex)

  return (
    <div className="text-white text-center p-8">
      <h1 className="text-3xl font-bold mb-4">Hari ini: {currentDay}</h1>
      {TodayComponent || <p className="text-gray-400">Tidak ada jadwal hari ini</p>}
    </div>
  )
}

export default Schedule

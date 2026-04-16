import React, { useState } from "react"
// Import komponen dan modul Swiper React
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules"

// Import CSS bawaan Swiper
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"

import ButtonSend from "../components/ButtonSend"
import ButtonRequest from "../components/ButtonRequest"
import Modal from "@mui/material/Modal"
import { Box, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { useSpring, animated } from "@react-spring/web"

// DAFTAR FOTO: Masukkan nama file foto yang sudah kamu simpan di folder public/gallery/
const DAFTAR_FOTO = [
	"/gallery/foto1.jpg",
	"/gallery/foto2.jpg",
	"/gallery/foto3.jpg",
	"/gallery/foto4.jpg",
	"/gallery/foto5.jpg"
]

const Carousel = () => {
	const [open, setOpen] = useState(false)
	const [selectedImage, setSelectedImage] = useState(null)

	const modalFade = useSpring({
		opacity: open ? 1 : 0,
		config: { duration: 300 }, 
	})

	const handleImageClick = (imageUrl) => {
		setSelectedImage(imageUrl)
		setOpen(true)
	}

	const handleCloseModal = () => {
		setOpen(false)
		setSelectedImage(null)
	}

	return (
		<>
			{/* Kontainer utama agar judul dan slider rata tengah */}
			<div className="w-full flex flex-col items-center mt-24 mb-10 px-4" id="Gallery">
    
    <div className="text-white opacity-80 text-2xl md:text-3xl font-bold mb-8 text-center tracking-wide">
        Class Gallery
				</div>
            
				<div id="Carousel" className="w-full max-w-5xl">
					{DAFTAR_FOTO.length > 0 ? (
						<Swiper
							effect={"coverflow"}
							grabCursor={true}
							centeredSlides={true}
							slidesPerView={"auto"}
							loop={true}
							// Jika gambar kurang dari 5, batasi loopnya agar tidak error
							loopAdditionalSlides={DAFTAR_FOTO.length >= 5 ? 5 : DAFTAR_FOTO.length} 
							coverflowEffect={{
								rotate: 0,
								stretch: 0, // KUNCI 1: Diubah ke 0 agar slide tidak saling menekan ke tengah
								depth: 100, // Kedalaman 3D diperhalus
								modifier: 1.5,
								slideShadows: false, // KUNCI 2: Dimatikan agar tidak ada blok hitam tebal di atas foto
							}}
							pagination={{ 
								clickable: true,
							}}
							autoplay={{
								delay: 3000,
								disableOnInteraction: false,
							}}
							modules={[EffectCoverflow, Pagination, Autoplay]}
							className="w-full py-10" // Tambahan py-10 agar foto yang di tengah bebas membesar
						>
							{DAFTAR_FOTO.map((imageUrl, index) => (
								<SwiperSlide
									key={index}
									// Mengatur ukuran kartu dan memperhalus shadow agar cocok di tema gelap
									className="w-[260px] md:w-[320px] relative rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/10"
								>
									<img
										src={imageUrl}
										alt={`Image ${index}`}
										onClick={() => handleImageClick(imageUrl)}
										className="w-full h-[350px] md:h-[420px] object-cover cursor-pointer hover:scale-105 transition-transform duration-500 ease-out"
									/>
								</SwiperSlide>
							))}
						</Swiper>
					) : (
						<div className="text-white text-center opacity-50">Belum ada foto di gallery...</div>
					)}
				</div>
			</div>

			<div className="flex justify-center items-center gap-6 text-base mt-5 lg:mt-8">
				<ButtonSend />
				<ButtonRequest />
			</div>

			<Modal
				open={open}
				onClose={handleCloseModal}
				aria-labelledby="image-modal"
				aria-describedby="image-modal-description"
				className="flex justify-center items-center">
				<animated.div
					style={{
						...modalFade,
						maxWidth: "90vw",
						maxHeight: "auto",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						position: "relative",
					}}
					className="p-2 rounded-lg">
					<IconButton
						edge="end"
						color="inherit"
						onClick={handleCloseModal}
						aria-label="close"
						sx={{
							position: "absolute",
							top: "12px",
							right: "23px",
							backgroundColor: "white",
							borderRadius: "50%",
						}}>
						<CloseIcon />
					</IconButton>
					<div className="w-full">
						<img
							src={selectedImage}
							alt="Selected Image"
							style={{ maxWidth: "100%", maxHeight: "100vh" }}
						/>
					</div>
				</animated.div>
			</Modal>
		</>
	)
}

export default Carousel

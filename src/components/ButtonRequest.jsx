import React, { useState } from "react"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import Typography from "@mui/material/Typography"
import { useSpring, animated } from "@react-spring/web"
import CloseIcon from "@mui/icons-material/Close"

export default function ButtonRequest() {
	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	const fade = useSpring({
		opacity: open ? 1 : 0,
		config: { duration: 200 },
	})

	return (
		<div>
			<button
				onClick={handleOpen}
				className="flex items-center space-x-2 text-white px-6 py-4"
				id="SendRequest">
				<img src="/Request.png" alt="Icon" className="w-6 h-6 relative bottom-1 " />
				<span className="text-base lg:text-1xl">Request</span>
			</button>

			<Modal
				open={open}
				onClose={handleClose}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}>
				<animated.div style={fade}>
					<Box className="modal-container bg-[#18181b] p-6 rounded-xl border border-white/10 relative max-w-[400px] mx-auto mt-[20vh]">
						<CloseIcon
							style={{ position: "absolute", top: "15px", right: "15px", cursor: "pointer", color: "grey" }}
							onClick={handleClose}
						/>
						<Typography sx={{ mt: 2 }}>
							<h6 className="text-center text-white text-2xl mb-5 font-semibold">Request</h6>
							<div className="h-[10rem] flex items-center justify-center text-white/50 text-center px-4">
								Fitur Request saat ini sedang dalam perbaikan (migrasi database).
							</div>
						</Typography>
					</Box>
				</animated.div>
			</Modal>
		</div>
	)
}

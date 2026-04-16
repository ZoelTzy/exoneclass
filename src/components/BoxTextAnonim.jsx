import * as React from "react"
import PropTypes from "prop-types"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useSpring, animated } from "@react-spring/web"
import Chat from "./ChatAnonim"
import CloseIcon from "@mui/icons-material/Close"

const Fade = React.forwardRef(function Fade(props, ref) {
	const { children, in: open, onClick, onEnter, onExited, ...other } = props
	const style = useSpring({
		from: { opacity: 0 },
		to: { opacity: open ? 1 : 0 },
		config: {
			duration: open ? 200 : 50,
		},
		onStart: () => {
			if (open && onEnter) {
				onEnter(null, true)
			}
		},
		onRest: () => {
			if (!open && onExited) {
				onExited(null, true)
			}
		},
	})

	return (
		<animated.div ref={ref} style={style} {...other}>
			{React.cloneElement(children, { onClick })}
		</animated.div>
	)
})

Fade.propTypes = {
	children: PropTypes.element.isRequired,
	in: PropTypes.bool,
	onClick: PropTypes.any,
	onEnter: PropTypes.func,
	onExited: PropTypes.func,
}

export default function BoxTextAnonim() {
	const [open, setOpen] = React.useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	return (
		<div>
			{/* DESAIN TOMBOL PERSEGI PANJANG */}
			<div onClick={handleOpen} className="w-full bg-[#3f3f46]/40 hover:bg-[#52525b]/60 transition-colors duration-300 rounded-3xl p-5 md:p-6 cursor-pointer flex justify-between items-center shadow-lg border border-white/10 backdrop-blur-sm">
				<div className="flex items-center gap-4">
					<img src="/paper-plane.png" alt="Icon Pesan" className="h-6 w-auto opacity-90" />
					<span className="text-white font-bold text-lg md:text-xl tracking-wide capitalize">
						Text Anonim
					</span>
				</div>
				<img src="/next.png" alt="Panah" className="h-4 w-4 opacity-70" />
			</div>

			<Modal
				aria-labelledby="spring-modal-title"
				aria-describedby="spring-modal-description"
				open={open}
				onClose={handleClose}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						TransitionComponent: Fade,
					},
				}}>
				<Fade in={open}>
					<Box
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							bgcolor: "#18181b", // Ubah warna latar chat biar tidak putih mencolok
                            color: "white",
							boxShadow: 24,
							borderRadius: 3,
							p: 4,
							width: { xs: "90%", sm: 500 },
							maxHeight: "90vh",
							overflowY: "auto",
						}}>
						<Button
							onClick={handleClose}
							sx={{
								position: "absolute",
								top: 10,
								right: 10,
								color: "gray",
								minWidth: "auto",
							}}>
							<CloseIcon />
						</Button>

						<Typography id="spring-modal-description" sx={{ mt: 2 }}>
							<Chat />
						</Typography>
					</Box>
				</Fade>
			</Modal>
		</div>
	)
}

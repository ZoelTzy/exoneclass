import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { useTheme } from "@mui/material/styles"
import AppBar from "@mui/material/AppBar"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import StrukturKelas from "./StrukturKelas"
import Schedule from "./Schedule"
import AOS from "aos"
import "aos/dist/aos.css"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

function TabPanel(props) {
	useEffect(() => {
		AOS.init()
		AOS.refresh()
	}, [])

	const { children, value, index, ...other } = props

	return (
		<div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
			{value === index && (
				<Box sx={{ p: 0 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	)
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
}

function a11yProps(index) {
	return {
		id: `full-width-tab-${index}`,
		"aria-controls": `full-width-tabpanel-${index}`,
	}
}

export default function FullWidthTabs() {
	const [value, setValue] = React.useState(0)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	return (
		<div className="md:px-[10%] md:mt-5 mt-8" id="Tabs" data-aos="fade-up" data-aos-duration="800">
			<div className="font-medium text-[1.6rem] md:text-[1.8rem] relative md:top-[2.8rem] top-[2.7rem] text-center text-white" id="Glow">
				
			</div>
			<Box sx={{ width: "100%" }}>
				<AppBar position="static" sx={{ bgcolor: "transparent", boxShadow: "none" }} className="px-[10%]">
					<Tabs
						value={value}
						onChange={handleChange}
						textColor="inherit"
						indicatorColor="inherit"
						variant="scrollable"
						scrollButtons="auto"
						sx={{
							display: "flex",
							justifyContent: "center",
							width: "auto",
							margin: "0 auto",
							"& .MuiTabs-indicator": {
								borderBottom: "2px solid white",
							},
						}}
						className="font-medium text-white text-2xl text-center mt-16"
						id="Glow">
						<Tab label="Structure" {...a11yProps(1)} sx={tabStyles} />
					</Tabs>
				</AppBar>

				<Swiper onSlideChange={(swiper) => setValue(swiper.activeIndex)} onSwiper={(swiper) => swiper.slideTo(value)}>
					<SwiperSlide>
						<TabPanel value={value} index={0}>
							<StrukturKelas />
						</TabPanel>
					</SwiperSlide>
					<SwiperSlide>
						<TabPanel value={value} index={1}>
							<Schedule />
						</TabPanel>
					</SwiperSlide>
				</Swiper>
			</Box>
		</div>
	)
}

const tabStyles = {
	fontWeight: "medium",
	color: "white",
	fontSize: ["1.5rem"],
	textTransform: "capitalize",
	fontFamily: '"Poppins", sans-serif',
	padding: "0.5rem",
	margin: "0 0.7rem",
}

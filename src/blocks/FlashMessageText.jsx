import { consumeFlash } from "./Functions"


const FlashMessageText = (props) => {
	const flashStyles = {
		"error": {
			fontWeight: "bold",
			color: "red",
			textAlign: "center",
		},
	}
	const flash = consumeFlash(props.flashName);
	if (flash != null) {
		return (
		<p style={flashStyles[flash.type]}>{flash.message}</p>
		)
	}
	return null;
}

export default FlashMessageText;

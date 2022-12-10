export default function Die(props) {

    const styles = {
        backgroundColor: props.isHeld === true ? "#59E391" : "white"
    }

    return (
        < p id="die-face" style={styles} onClick={props.handleDieClick}> {props.value} </p>
        // < p id="die-face" className={`die-face-${props.value}`} style={styles} onClick={props.handleDieClick}></p>
    )
}
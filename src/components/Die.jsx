export default function Die(props) {

    const styles = {
        backgroundColor: props.isHeld === true ? "#59E391" : "white"
    }

    return (
        <div>
            <p id="die-face" style={styles} onClick={props.handleDieClick}> {props.value} </p>
        </div>
    )
}
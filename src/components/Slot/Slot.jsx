const Slot = ({ title, img }) => {
    return (
        <li>
            <a href="">
                <img src={img} alt="" />
                <h3>{title}</h3>
            </a>
        </li>
    );
}

export default Slot;
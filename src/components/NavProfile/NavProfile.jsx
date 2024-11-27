import "./NavProfile.css"

const NavProfile = ({ isOpen, onClose }) => {

    const onWrapperClick = (event) => {
        if (event.target.classList.contains("container-body-account")) onClose();
    };

    return (

        <>

            {
                isOpen && (
                    <div onClick={onWrapperClick} className="container-body-account">
                        <div className="container-account">

                        </div>
                    </div>
                )
            }
        </>
    );
}

export default NavProfile;
const Rocket = () => {
    return (
        <div className="rocket__container">
            <div className="rocket__content">
                <div className="rocket__left">
                    <div className="history__game">
                        <div className="all__game">Все</div>
                        <div className="my__game">Мои</div>
                    </div>

                    <div className="history__betting">
                        <div className="betting-top">
                            <p>Всего ставок:</p>
                        </div>

                        <div className="betting-main"></div>
                    </div>
                </div>


                {/* <div className="rocket__center"></div>
                <div className="rocket__right"></div> */}
            </div>
        </div>
    );
}

export default Rocket;
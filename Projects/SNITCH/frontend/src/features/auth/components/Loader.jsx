import React from 'react'

const Loader = () => {
    return (
        <div className="relative w-full h-screen font-['Montserrat']">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
                <div className="relative inline-block h-[37px] w-[15px]">
                    <style>{`
                        .bounceball::before {
                            position: absolute;
                            content: '';
                            display: block;
                            top: 0;
                            width: 15px;
                            height: 15px;
                            border-radius: 50%;
                            background-color: #fbae17;
                            transform-origin: 50%;
                            animation: bounce 500ms alternate infinite ease;
                        }
                        @keyframes bounce {
                            0% {
                                top: 30px;
                                height: 5px;
                                border-radius: 60px 60px 20px 20px;
                                transform: scaleX(2);
                            }
                            35% {
                                height: 15px;
                                border-radius: 50%;
                                transform: scaleX(1);
                            }
                            100% {
                                top: 0;
                            }
                        }
                    `}</style>
                    <div className="bounceball" />
                </div>
                <div className="text-[#fbae17] inline-block ml-[5px] font-semibold tracking-widest text-sm">
                    NOW LOADING
                </div>
            </div>
        </div>
    )
}

export default Loader
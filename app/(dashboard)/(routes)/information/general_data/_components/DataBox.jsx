import React from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DataBox = ({ title, content }) => {
    const projectProgress = 86; // نسبة التقدم

    // نصف قطر الدائرة
    const radius = 38;
    // مركز الدائرة (منتصف العنصر)
    const center = 48;
    // سماكة الـ stroke
    const strokeWidth = 8;
    // معامل تصحيح المواضع
    const offsetCorrection = -10; // تقليل انحراف الدوائر

    // تحويل النسبة إلى زوايا
    const startAngle = -90; // بداية الرسم
    const endAngle = (projectProgress / 100) * 360 - 90; // نهاية الرسم

    // تحويل الزاوية إلى إحداثيات X, Y
    const getCirclePosition = (angle) => {
        const radian = (angle * Math.PI) / 180;
        return {
            x: center + (radius - strokeWidth / 2 - offsetCorrection) * Math.cos(radian),
            y: center + (radius - strokeWidth / 2 - offsetCorrection) * Math.sin(radian),
        };
    };

    const startPos = getCirclePosition(startAngle);
    const endPos = getCirclePosition(endAngle);

    return (
        <div className='px-4 bg-[#FEEEE6] rounded-md shadow-md h-[164px] relative'>
            <div className="flex justify-between py-4">
                <h4 className='text-base font-normal text-[#000000A6]'>{title}</h4>
                {
                    title === 'Project Name'
                    &&
                    <img src='/images/projectLogo.jpeg' className='w-12 h-12 object-cover rounded-md' />
                }
                {
                    title === 'Client Name'
                    &&
                    <img src="/images/clientLogo.jpeg" className='w-12 h-12 object-cover rounded-md' />
                }
                {
                    title === 'Consult'
                    &&
                    <img src="/images/aeLogo.jpeg" className='w-12 h-12 object-cover rounded-md' />
                }
            </div>

            <div className={`flex flex-col justify-center items-center ${title === 'Project Name' || title === 'Client Name' || title === 'Consult' ? 'h-[calc(100%-80px)] pb-[40px]' : 'h-[calc(100%-56px)] pb-[28px]'} relative`}>
                {title === 'Project Progress' ? (
                    <div className="relative w-24 h-24">
                        {/* الدائرة الرئيسية */}
                        <CircularProgressbar
                            background
                            className="font-bold"
                            value={projectProgress}
                            text={`${projectProgress}%`}
                            styles={buildStyles({
                                textSize: '20px',
                                pathColor: `#311200`,
                                textColor: '#000000CC',
                                backgroundColor: '#FA9B67',
                                trailColor: '#FA9B67',
                                strokeLinecap: 'round',
                            })}
                        />

                        {/* نقطة البداية */}
                        <div
                            className="absolute w-[10px] h-[10px] bg-white rounded-full border-[2px] border-[#311200]"
                            style={{
                                left: `${startPos.x}px`,
                                top: `${startPos.y}px`,
                                transform: 'translate(-50%, -50%)',
                            }}
                        ></div>

                        {/* نقطة النهاية */}
                        <div
                            className="absolute w-[10px] h-[10px] bg-white rounded-full border-[2px] border-[#311200]"
                            style={{
                                left: `${endPos.x}px`,
                                top: `${endPos.y}px`,
                                transform: 'translate(-50%, -50%)',
                            }}
                        ></div>
                    </div>
                ) : (
                    <p className='text-2xl font-bold text-[#000000CC]'>{content}</p>
                )}
            </div>
        </div>
    );
};

export default DataBox;

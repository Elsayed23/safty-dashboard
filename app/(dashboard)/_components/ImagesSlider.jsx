import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"

const Slider = ({ images }) => {
    return (
        <Carousel className="w-full max-w-xs">
            <CarouselContent className="h-full">
                {images?.map(({ path }, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1 h-full">
                            <Card className="h-full">
                                <Image src={path} alt="instrumet image" width={450} height={450} className="w-full h-full" />
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}

export default Slider
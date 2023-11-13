export const CALL_FEE = 0.2
export const DOLLAR_TO_GEMS = 100

const roundFloor = (amount: number) => Math.floor(amount * 100) / 100

const calculateGems = ({ price, fee, tips }: { price: number; fee: number; tips: number }) => {
    const gems = price - fee + tips
    if (gems === 0 || gems >= 1) {
        return gems
    }
    return 1
}

export const gemsToDollar = (gems: number) => roundFloor(gems / DOLLAR_TO_GEMS)

export const calculateEarnings = (pricePerSecond: number, duration: number, tips = 0) => {
    const price = roundFloor(pricePerSecond * duration) // Calculate the video call cost

    let fee = price * CALL_FEE // Calculate the video call fee

    if (tips > 0) {
        const tipsFee = tips * CALL_FEE // Calculate the fee on tips
        fee += tipsFee // Add the fee on tips to the total fee
    }

    const gems = calculateGems({ price, fee, tips })
    const earnings = gemsToDollar(gems)

    return {
        price,
        fee: roundFloor(fee),
        earnings,
    }
}

export const formatGemAmount = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const formatPrice = (price: number) => {
    const formattedPrice = price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
    return `$ ${formattedPrice}`
}

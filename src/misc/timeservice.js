export function coordsOnTime(boat, currentTime) {
    for (let i = 1; i < boat.data.length; i++) {
        if ((boat.data[i-1].UTC <= currentTime) && (boat.data[i].UTC >= currentTime)) {
            return [boat.data[i].LAT, boat.data[i].LON]
        }
    }
}

export function HDGonTime(boat, currentTime) {
    for (let i = 1; i < boat.data.length; i++) {
        if ((boat.data[i-1].UTC <= currentTime) && (boat.data[i].UTC >= currentTime)) {
            return boat.data[i].HDG;
        }
    }
}

export function AWAonTime(boat, currentTime) {
    for (let i = 1; i < boat.data.length; i++) {
        if ((boat.data[i-1].UTC <= currentTime) && (boat.data[i].UTC >= currentTime)) {
            return boat.data[i].AWA;
        }
    }
}

export function AllOnTime(boat, currentTime) {
    for (let i = 1; i < boat.data.length; i++) {
        if ((boat.data[i-1].UTC <= currentTime) && (boat.data[i].UTC >= currentTime)) {
            return boat.data[i];
        }
    }
}

export function sliceRouteByUTC(boat, startUTC, endUTC) {
    let i = 0; let j = 0;
    let startFlag = false
    let stopFlag = false
    for (let k = 0; k < boat.data.length; k++) {
        if ((boat.data[k].UTC >= startUTC) && (!startFlag)) {
            startFlag = true
            i = k
        }
        if ((boat.data[k].UTC >= endUTC) && (!stopFlag)) {
            stopFlag = true
            j = k
        }
    }

    return boat.coords.slice(i,j)
}

export function convertBoatTimeToUTC(boat) {
    boat.data.forEach(row => {
        const r = new Date()

        const date = row.DATE.split('-')
        r.setMonth(Number(date[0]), Number(date[1]))

        r.setHours(Number(row.HOUR), Number(row.MIN), Number(row.SEC))

        row.UTC = r.getTime()
    })

}
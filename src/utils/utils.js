import { calcStatScalingCurve, } from "../utils/calc";

const API_KEY = process.env.REACT_APP_API_KEY;
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID

async function safeFetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(url + ' returned status ' + response.status);
    }
    return await response.json();
}

async function loadSheet(sheetName) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!A2:F2526?key=${API_KEY}`);
    const data = await response.json();
    return data.values;
}

function weaponScalingValues(name, sheet) {
    const temp = []
    sheet.filter(e => name === e[0]).map(e => e.forEach(value => temp.push(value)));

    const scalings = {
        Str: +temp[1],
        Dex: +temp[2],
        Int: +temp[3],
        Fai: +temp[4],
        Arc: +temp[5]
    }
    return { ...scalings }
}

function getWeaponGroupingId(name, sheet) {
    const id = sheet.filter(e => name === e[0]);
    return id.length !== 0 ? id[0][1] : 10000;
}

function groupingScalingValue(id, sheet, scalingValues) {
    const groupings = {
        Phy: {},
        Mag: {},
        Fire: {},
        Ligt: {},
        Holy: {},
    }

    const arr = []
    //I hate this
    sheet.filter(e => e[0] === id).forEach(e => e.forEach(value => arr.push(value)))
    const types = ['Phy', 'Mag', 'Fire', 'Ligt', 'Holy'];
    for (let i = 1; i < arr.length; i++) {
        arr[i].split(' ').forEach(e => groupings[types[i - 1]][e] = { scaling: scalingValues[e] })
    }

    return { ...groupings }
}

function groupingReqValues(req, grouping) {
    const obj = { ...grouping }

    Object.keys(obj).forEach(e => obj[e].reqMet = [])

    Object.keys(req).forEach(stat => Object.keys(obj).forEach(dmgType => {
        if (obj[dmgType][stat] !== undefined)
            obj[dmgType].reqMet.push(req[stat].reqMet)
    }))

    return { ...obj }
}

function calcStatValue(currentWeapon, currentClass) {
    const obj = {}
    typeof currentWeapon.scalesWith !== 'undefined' && Object.keys(currentClass).map(stat =>
        currentWeapon.scalesWith.forEach(e => {
            if (stat.toLowerCase().includes(e.name.toLowerCase()))
                obj[e.name] = +currentClass[stat]
        })
    )
    Object.keys(obj).forEach(e => obj[e] = calcStatScalingCurve(obj[e], e))
    return { ...obj }
}

function groupingStatValues(group, stats) {
    const obj = { ...group }
    Object.keys(obj).forEach(dmgType => Object.keys(stats).forEach(stat => {
        if (obj[dmgType][stat] !== undefined)
            obj[dmgType][stat].statScaling = stats[stat]
    }))

    return { ...obj }
}

function addBaseDmgValues(attacks, grouping) {
    const obj = { ...grouping }
    attacks.filter(e => e.name !== 'Crit').forEach(dmgType => Object.keys(grouping).forEach(type =>
        Object.keys(obj[type]).forEach(stat => {
            if (dmgType.name === type && stat !== 'reqMet')
                obj[type][stat].base = dmgType.amount
        })
    ))
    return { ...obj }
}


export {
    safeFetchJson,
    loadSheet,
    weaponScalingValues,
    getWeaponGroupingId,
    groupingScalingValue,
    groupingReqValues,
    calcStatValue,
    groupingStatValues,
    addBaseDmgValues,
};

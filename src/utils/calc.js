function calcStatScalingCurve(statLvl, statName) {
    const obj = {
        stat: [1, 18, 60, 80, 150],
        grow: [0, 25, 75, 90, 110],
        exponent: [1.2, -1.2, 1, 1, 1]
    };

    //Wait and see if the sheet makers respond
    if (statName === 'Arc')
        obj.stat = [1, 25, 45, 60, 150]

    obj.stat.push(statLvl)
    obj.stat.sort((a, b) => a - b);
    const index = obj.stat.indexOf(statLvl);

    const ratio = (statLvl - obj.stat[index - 1]) / (obj.stat[index + 1] - obj.stat[index - 1]);
    let growth = 1;
    if (obj.exponent[index - 1] > 0 && statName !== 'Arc')
        growth = Math.pow(ratio, obj.exponent[index - 1]);
    if (obj.exponent[index - 1] < 0 && statName !== 'Arc')
        growth = 1 - Math.pow(1 - ratio, -1 * obj.exponent[index - 1]);

    const output = obj.grow[index - 1] + ((obj.grow[index] - obj.grow[index - 1]) * growth)
    return output / 100;
}

function calcAttack(groupings) {
    const obj = { ...groupings }
    const dmgCalcs = {
        Phy: [],
        Mag: [],
        Fire: [],
        Ligt: [],
        Holy: [],
    }

    Object.keys(obj).forEach(e => {
        Object.keys(obj[e]).forEach(stat => {
            if (stat !== 'reqMet') {
                Object.keys(stat).forEach(() => {
                    if (obj[e].reqMet.includes(false) && obj[e][stat].base !== undefined) 
                        dmgCalcs[e].push(Math.round(-0.4 * obj[e][stat].base))
                    else if (obj[e][stat].statScaling !== undefined)
                        dmgCalcs[e].push(obj[e][stat].base * obj[e][stat].scaling * obj[e][stat].statScaling)
                })
            }
        })
    })
    
    Object.keys(dmgCalcs).forEach(e => dmgCalcs[e] = [...new Set(dmgCalcs[e])].reduce((acc, value) => acc + value, 0))
    
    Object.keys(obj).forEach(type => obj[type].calc = Math.floor(dmgCalcs[type]))
    
    return { ...obj };
}

export { calcStatScalingCurve, calcAttack };
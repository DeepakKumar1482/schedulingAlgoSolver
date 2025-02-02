function getInputNumbers(id) {
    return document.getElementById(id).value
        .split(" ")
        .map(function(val) {
            return parseInt(val);
        })
        .filter(function(val) {
            return !isNaN(val);
        });
}

function PP() {
    const arrivalTimeArray = getInputNumbers("arrivaltime");
    const burstTimeArray = getInputNumbers("bursttime");
    const priorityArray = getInputNumbers("priority");
    const arrivalLen = arrivalTimeArray.length;
    const burstLen = burstTimeArray.length;
    if (!arrivalLen)
        return errorMessage("Arrival time cannot be blank.");
    else if (!burstLen)
        return errorMessage("Burst time cannot be blank.");
    else if (!arrivalLen)
        return errorMessage("Priorities cannot be blank.");
    else if (burstTimeArray.some(el => el === 0))
        return errorMessage("0 as burst time is invalid.");
    else if (arrivalLen != burstLen)
        return errorMessage("The number of arrival times and burst times does not match.");
    else if (burstLen != priorityArray.length)
        return errorMessage("Arrival times, burst times and priorities should have equal length");
    else if (arrivalTimeArray.some(el => el < 0))
        return errorMessage("Negative numbers can be valid for arrival times.");
    else if (burstTimeArray.some(el => el < 0))
        return errorMessage("Negative numbers can be valid for burst times.");
    else if (priorityArray.some(el => el < 0))
        return errorMessage("Negative numbers can be valid for Priorities.");
    let inputArray = [];
    for (let i = 0; i < arrivalTimeArray.length; i++)
        inputArray.push([arrivalTimeArray[i], burstTimeArray[i], priorityArray[i]]);
    PPSOLVE(inputArray);
}


class Process3 {
    constructor(processNumber, arrivalTime, burstTime, priority) {
        this.visit = 0;
        this.waitingTime = 0;
        this.completionTime = 0;
        this.turnAroundTime = 0;
        this.priority = priority;
        this.burstTime = burstTime;
        this.arrivalTime = arrivalTime;
        this.tempburstTime = burstTime;
        this.processNumber = processNumber;

    }
}

function PPSOLVE(inputArray) {
    const processArray = [];
    var arrayLen = inputArray.length,
        t = 0,
        ch = 0;
    var avgturnAroundTime = 0,
        avgwaitingTime = 0;
    for (var i = 0; i < arrayLen; i++) {
        const process = new Process3(i + 1, inputArray[i][0], inputArray[i][1], inputArray[i][2]);
        processArray.push(process);
    }
    sortArray(processArray, 'priority');
    const grantChart = document.querySelector(".GrantChart");
    if (grantChart) {
        while (grantChart.firstChild) {
            grantChart.removeChild(grantChart.firstChild);
        }
        grantChart.innerHTML = "";
    }
    let grantChartArray = [];
    var blankSpace = false;
    var firstBlankSpace = true;
    while (true) {
        var ch = 0,
            zeroFound = 0;
        blankSpace = false;
        for (var i = 0; i < arrayLen; i++) {
            if (processArray[i].burstTime != 0)
                zeroFound = 1;
            if ((processArray[i].burstTime != 0) && (processArray[i].visit == 0) && t >= processArray[i].arrivalTime) {
                t += 1;
                ch = 1;
                blankSpace = true;
                firstBlankSpace = false;
                processArray[i].burstTime -= 1;
                if (processArray[i].burstTime == 0) {
                    processArray[i].completionTime = t;
                    processArray[i].turnAroundTime = processArray[i].completionTime - processArray[i].arrivalTime;
                    processArray[i].waitingTime = processArray[i].turnAroundTime - processArray[i].tempburstTime;
                    avgturnAroundTime += processArray[i].turnAroundTime;
                    avgwaitingTime += processArray[i].waitingTime;
                    processArray[i].visit = 1;
                }
                grantChartArray.push([processArray[i].processNumber, t]);
                break;
            }
        }
        if (zeroFound == 1 && ch == 0)
            t += 1;
        else if (!zeroFound)
            break;
        if (!blankSpace && !firstBlankSpace) {
            grantChartArray.push(["-", t]);
        }
        sortArray(processArray, 'priority');
    }
    printGrantChart(grantChartArray);
    const data = processArray;
    tablePrint(data, avgturnAroundTime, avgwaitingTime, "PP");
}
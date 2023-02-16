import operator
import datetime
import pandas as pd


Col_Id = 0
Col_TournId = 1
Col_Player1Id = 2
Col_Player2Id = 3
Col_Comment = 4
Col_Completed = 5
Col_Stage = 6
Col_StartDate = 7
Col_WinnerId = 8
Col_Score = 9
Col_Player3Id = 10
Col_Player4Id = 11

UseCustomInitialPoints = True
InitialPoints = 1100
LevelPointsDifference = 200
DefaultKFactor = 32
NoPointsDifference = 50
PointsForMatchPlayed = 0
TwoSetsMatchScoreLength = 7
KfactorDynamic = False
CoefStraightSets = 1.0
CoefMatchVsHigherLevel = 1

Levels = [-1, 0, 1, 2, 3, 4]

InitPointsByLevelDict = {}

columnsPlayers = []
playersDict = {}
pointsSinglesDict = {}
matchesPlayedDict = {}
lastMatchDateDict = {}
winsDict = {}
winsHigherLevelDict = {}
lossesDict = {}
lossesLowerLevelDict = {}
sortedPoints = None


def setInitialPointsByLevel():
    pointsForLevel = InitialPoints

    for level in Levels:
        InitPointsByLevelDict[level] = pointsForLevel
        pointsForLevel += LevelPointsDifference


def getProbability(ranking_player, ranking_opponent):
    probability = float(1)/(1+10**(float(ranking_opponent - ranking_player)/400))
    return probability


def getPlayerKfactors(player1Id, player2Id):
    kFactorP1 = kFactorP2 = DefaultKFactor

    if KfactorDynamic:
        matchesPlayedP1 = 0 if player1Id not in matchesPlayedDict else matchesPlayedDict[player1Id]
        matchesPlayedP2 = 0 if player2Id not in matchesPlayedDict else matchesPlayedDict[player2Id]

        kFactorP1 = float(250) / ((matchesPlayedP1 + 5) ** 0.4)
        kFactorP2 = float(250) / ((matchesPlayedP2 + 5) ** 0.4)

    return (kFactorP1, kFactorP2)


def intOrZero(value):
    result = 0

    if value is not None:
        try:
            result = int(value)
        except:
            pass

    return result


def actionPlayers(csvData):
    rowData = csvData[0].split(';')

    playerInfo = {
        "playerId": getCsvValueFromColumn(rowData, columnsPlayers, 'id'),
        "firstName": getCsvValueFromColumn(rowData, columnsPlayers, 'first_name'),
        "lastName": getCsvValueFromColumn(rowData, columnsPlayers, 'last_name'),
        "level": getCsvValueFromColumn(rowData, columnsPlayers, 'level'),
        "initPoints": intOrZero(getCsvValueFromColumn(rowData, columnsPlayers, 'init_points'))
    }

    # print(playerInfo["initPoints"])

    if playerInfo["level"] == '':
        playerInfo["level"] = 1

    playerId = playerInfo["playerId"]
    playersDict[playerId] = playerInfo
    pointsSinglesDict[playerId] = InitPointsByLevelDict[int(playerInfo["level"])] if not UseCustomInitialPoints else playerInfo["initPoints"]
    winsDict[playerId] = 0
    winsHigherLevelDict[playerId] = 0
    lossesDict[playerId] = 0
    lossesLowerLevelDict[playerId] = 0


def preActionMatches(row):
    values = row[0].split(';')
    comment = values[Col_Comment]
    date = datetime.datetime.strptime(values[Col_StartDate], '%Y-%m-%d')
    player3Id = values[Col_Player3Id]
    player4Id = values[Col_Player4Id]

    if len(comment) > 0 or len(player3Id) > 0:
        # print("ret or doubles : '{}'".format(player3Id))
        return

    player1Id = values[Col_Player1Id]
    player2Id = values[Col_Player2Id]

    if player1Id in matchesPlayedDict:
        matchesPlayedDict[player1Id] += 1

    if player2Id in matchesPlayedDict:
        matchesPlayedDict[player2Id] += 1

    if player1Id not in lastMatchDateDict or lastMatchDateDict[player1Id] < date:
        lastMatchDateDict[player1Id] = date

    if player2Id not in lastMatchDateDict or lastMatchDateDict[player2Id] < date:
        lastMatchDateDict[player2Id] = date


def actionMatches(row):
    # print(row)
    values = row[0].split(';')
    comment = values[Col_Comment]
    player1Id = values[Col_Player1Id]
    player2Id = values[Col_Player2Id]
    player3Id = values[Col_Player3Id]
    player4Id = values[Col_Player4Id]

    if not playersDict.__contains__(player1Id) or not playersDict.__contains__(player2Id):
        return

    if len(comment) > 0 or len(player3Id) > 0:
        # print("retired or doubles : '{}'".format(player3Id))
        return

    player1IsWinner = values[Col_WinnerId] == player1Id
    score = values[Col_Score]

    player1Level = int(playersDict[player1Id]['level'])
    player2Level = int(playersDict[player2Id]['level'])
    levelDiff = player1Level - player2Level
    coefHigherLevel = CoefMatchVsHigherLevel ** levelDiff

    pointsDiff = abs(pointsSinglesDict[player1Id] - pointsSinglesDict[player2Id])

    inStraightSets = len(score) == TwoSetsMatchScoreLength
    coefMatchResult = CoefStraightSets if inStraightSets else 1

    kFactorsTuple = getPlayerKfactors(player1Id, player2Id)

    probabilityP1Wins = getProbability(pointsSinglesDict[player1Id], pointsSinglesDict[player2Id])

    pointsDeltaP1 = int(coefMatchResult * kFactorsTuple[0] * probabilityP1Wins)
    pointsDeltaP2 = int(coefMatchResult * kFactorsTuple[1] * (1 - probabilityP1Wins))

    if player1IsWinner:
        if levelDiff < 0:
            winsHigherLevelDict[player1Id] += 1
            lossesLowerLevelDict[player2Id] += 1

        if pointsDiff <= NoPointsDifference:
            pointsSinglesDict[player1Id] += pointsDeltaP1
            pointsSinglesDict[player2Id] -= pointsDeltaP2

        winsDict[player1Id] += 1
        lossesDict[player2Id] += 1
    else:
        if levelDiff > 0:
            winsHigherLevelDict[player2Id] += 1
            lossesLowerLevelDict[player1Id] += 1

        if pointsDiff <= NoPointsDifference:
            pointsSinglesDict[player2Id] += pointsDeltaP1
            pointsSinglesDict[player1Id] -= pointsDeltaP2

        winsDict[player2Id] += 1
        lossesDict[player1Id] += 1

    pointsSinglesDict[player1Id] += PointsForMatchPlayed
    pointsSinglesDict[player2Id] += PointsForMatchPlayed


def getLevelDisplay(levelId):
    levelId = int(levelId)
    levelDisplay = 'Sattelite'
    if levelId == 0:
        levelDisplay = 'Futures'
    elif levelId == 1:
        levelDisplay = 'Challenger'
    elif levelId == 2:
        levelDisplay = 'Masters'
    elif levelId == 3:
        levelDisplay = 'Pro'
    elif levelId == 4:
        levelDisplay = 'Legger'

    return levelDisplay


def getColumnData(value, length):
    stringValue = str(value)
    indent = 0

    if len(stringValue) < length:
        indent = length - len(stringValue)

    result = (indent * " ") + stringValue
    return result


def writeRankingsToFile(fileName):
    fileNameSuffix = datetime.datetime.now().strftime("_%Y%m%d_%H-%M-%S")

    f = open(fileName + fileNameSuffix + ".txt", "a")
    f.seek(0)
    f.truncate()

    initPointsStat = ""
    for level in InitPointsByLevelDict:
        initPointsStat += getLevelDisplay(level) + ": " + str(InitPointsByLevelDict[level]) + ", "

    f.write("{} = {}\n".format(getColumnData("Initial Points", 20), initPointsStat if not UseCustomInitialPoints else 'Custom'))
    f.write("{} = {}\n".format(getColumnData("Kfactor", 20), "Dynamic" if KfactorDynamic else DefaultKFactor))
    f.write("{} = {}\n".format(getColumnData("NoPointsDifference", 20), NoPointsDifference))
    f.write("{} = {}\n\n".format(getColumnData("Straight sets coef", 20), CoefStraightSets))

    columnSeparator = " | "
    newLine = "\n"

    resultColumns = [
        getColumnData('#', 4),
        getColumnData('pts', 6),
        getColumnData('won', 5),
        getColumnData('lost', 5),
        getColumnData('w/l', 5),
        getColumnData('WvsH', 5),
        getColumnData('LvsL', 5),
        getColumnData('lvl', 10),
        getColumnData('last date', 12),
        getColumnData('ID', 7),
        'name'
    ]

    columnsString = ""
    for idx, colName in enumerate(resultColumns):
        columnsString += colName + (columnSeparator if idx < len(resultColumns) - 1 else newLine)

    f.write(columnsString)

    index = 0

    for t in sortedPoints:
        playerId = t[0]
        if not lastMatchDateDict.__contains__(playerId) or lastMatchDateDict[playerId] + datetime.timedelta(365) < datetime.datetime.now():
            continue

        index += 1

        playerInfo = playersDict[playerId]
        points = t[1]
        fullName = playerInfo["firstName"] + " " + playerInfo["lastName"]
        level = playerInfo["level"]
        wins = winsDict[playerId]
        losses = lossesDict[playerId]
        winsVsHigher = winsHigherLevelDict[playerId]
        lossesVsLower = lossesLowerLevelDict[playerId]
        lastMatchDate = lastMatchDateDict[playerId].strftime("%Y-%m-%d")

        resultValues = [
            getColumnData(index, 4),
            getColumnData(points, 6),
            getColumnData(wins, 5),
            getColumnData(losses, 5),
            getColumnData(wins-losses, 5),
            getColumnData(winsVsHigher, 5),
            getColumnData(lossesVsLower, 5),
            getColumnData(getLevelDisplay(level), 10),
            getColumnData(lastMatchDate, 12),
            getColumnData(playerId, 7),
            fullName
        ]

        resultValuesString = ""

        for idx, valString in enumerate(resultValues):
            resultValuesString += valString + (columnSeparator if idx < len(resultValues) - 1 else newLine)

        f.write(resultValuesString)

    f.close()


def getCsvColumns(csvData):
    columns = csvData.columns.tolist()[0].split(';')
    return columns


def getCsvValueFromColumn(csvRow, columns, columnName):
    value = ''
    try:
        columnIndex = columns.index(columnName)
        value = csvRow[columnIndex]
    except:
        pass

    return value


setInitialPointsByLevel()

dataSetPlayers = pd.read_csv(r'players_070222.csv')
columnsPlayers = getCsvColumns(dataSetPlayers)
dataSetPlayers.apply(actionPlayers, axis=1)

dataSetMatches = pd.read_csv(r'matches_2021.csv')
dataSetMatches.apply(preActionMatches, axis=1)
dataSetMatches.apply(actionMatches, axis=1)

sortedPoints = sorted(pointsSinglesDict.items(), key=operator.itemgetter(1), reverse=True)

writeRankingsToFile("Points")
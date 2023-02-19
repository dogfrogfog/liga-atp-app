DefaultKFactor = 32
NoPointsDifference = 50
PointsForMatchPlayed = 0
TwoSetsMatchScoreLength = 7
KfactorDynamic = False
CoefStraightSets = 1.0
CoefMatchVsHigherLevel = 1

Levels = [-1, 0, 1, 2, 3, 4]

columnsPlayers = []
playersDict = {}
pointsSinglesDict = {}
matchesPlayedDict = {}
winsDict = {}
winsHigherLevelDict = {}
lossesDict = {}
lossesLowerLevelDict = {}
sortedPoints = None

// функция для расчета вероятности игроков
// на основе их текущих рейтингов 
def getProbability(ranking_player, ranking_opponent):
    probability = float(1)/(1+10**(float(ranking_opponent - ranking_player)/250))
    return probability

def intOrZero(value):
    result = 0

    if value is not None:
        try:
            result = int(value)
        except:
            pass

    return result

# исполняется перед прогоном массива матчей
# метод который применяется к каждой записи таблицы игроков
# и в последующем появляется дополнительная информация для игроков (коэфы и прочее)
def actionPlayers(csvData):
    playerId = playerInfo["playerId"]
    playersDict[playerId] = playerInfo
    pointsSinglesDict[playerId] = playerInfo["initPoints"]
    winsDict[playerId] = 0
    winsHigherLevelDict[playerId] = 0
    lossesDict[playerId] = 0
    lossesLowerLevelDict[playerId] = 0


# первый проход массива 
# функция которая считает значения, необходимые для эло
def preActionMatches(row):
    values = row[0].split(';')
    # match record values
    comment
    date
    player3Id
    player4Id

    player1Id
    player2Id

    # количество сыгранных матчей для 1 игрока
    if player1Id in matchesPlayedDict:
        matchesPlayedDict[player1Id] += 1

    # количество сыгранных матчей для 2 игрока
    if player2Id in matchesPlayedDict:
        matchesPlayedDict[player2Id] += 1


# прогон по всем матчам и расчет эло
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
    // КОЭФИЦЕНТ
    // если игрок выиграл не проиграв не одного сета
    // он получает коэфицент, увеличивающий количество выигранных очков ЭЛО
    coefMatchResult = CoefStraightSets if inStraightSets else 1

    // КОЭФИЦЕНТЫ
    // у каждого игрока будет коэфицент за количество сыгранных матчей
    kFactorsTuple = getPlayerKfactors(player1Id, player2Id)

    // функция для расчета вероятности игроков
    // на основе их текущих рейтингов 
    probabilityP1Wins = getProbability(pointsSinglesDict[player1Id], pointsSinglesDict[player2Id])

    pointsDeltaP1 = int(coefMatchResult * kFactorsTuple[0] * probabilityP1Wins)
    pointsDeltaP2 = int(coefMatchResult * kFactorsTuple[1] * (1 - probabilityP1Wins))

    if player1IsWinner:
        if pointsDiff <= NoPointsDifference:
            pointsSinglesDict[player1Id] += pointsDeltaP1
            pointsSinglesDict[player2Id] -= pointsDeltaP2
    else:
        if pointsDiff <= NoPointsDifference:
            pointsSinglesDict[player2Id] += pointsDeltaP1
            pointsSinglesDict[player1Id] -= pointsDeltaP2

    pointsSinglesDict[player1Id] += PointsForMatchPlayed
    pointsSinglesDict[player2Id] += PointsForMatchPlayed


# sortedPoints = sorted(pointsSinglesDict.items(), key=operator.itemgetter(1), reverse=True)

import operator
import datetime
import pandas as pd
import re
# from common.utils import parse_score


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

ConfigProp_DefaultKfactor = 0
ConfigProp_PontsForMatchPlayed = 1
ConfigProp_CoefStraightSets = 2
ConfigProp_UsePointsDifferenceCoef = 3
ConfigProp_InitialPoints = 4
ConfigProp_LevelPointsDifference = 5
ConfigProp_KfactorIsDynamic = 6
ConfigProp_UseCustomInitialPoints = 7
ConfigProp_SkipDoubles = 8

Config = {
    ConfigProp_DefaultKfactor: 32,
    ConfigProp_PontsForMatchPlayed: 1,
    ConfigProp_CoefStraightSets: 1.0,
    ConfigProp_UsePointsDifferenceCoef: True,
    ConfigProp_InitialPoints: 1100,
    ConfigProp_LevelPointsDifference: 200,
    ConfigProp_KfactorIsDynamic: False,
    ConfigProp_UseCustomInitialPoints: True,
    ConfigProp_SkipDoubles: False,
}

DoublesTeamIdSeparator = "012340"
TwoSetsMatchScoreLength = 7
ThreeStraightSetsMatchScoreLength = 11

Levels = [-1, 0, 1, 2, 3, 4, 5]

InitPointsByLevelDict = {}

columnsPlayers = []
playersDict = {}
playersPointsHistoryDict = {}
pointsDict = {}
matchesPlayedSinglesDict = {}
matchesPlayedDoublesDict = {}
lastMatchDateDict = {}
winsDict = {}
lossesDict = {}
winsDoublesDict = {}
lossesDoublesDict = {}
sortedPoints = None


def validateConfig():
    messages = []

    if not Config.__contains__(ConfigProp_DefaultKfactor) or not isinstance(Config[ConfigProp_DefaultKfactor], int):
        messages.append("ConfigProp_DefaultKfactor should be a positive number")
    if not Config.__contains__(ConfigProp_PontsForMatchPlayed) or not isinstance(Config[ConfigProp_PontsForMatchPlayed], int):
        messages.append("ConfigProp_PontsForMatchPlayed should be a positive number")
    if not Config.__contains__(ConfigProp_CoefStraightSets) or not isinstance(Config[ConfigProp_CoefStraightSets], float):
        messages.append("ConfigProp_CoefStraightSets should be a decimal number")
    if not Config.__contains__(ConfigProp_UsePointsDifferenceCoef) or not isinstance(Config[ConfigProp_UsePointsDifferenceCoef], bool):
        messages.append("ConfigProp_UsePointsDifferenceCoef should be True or False")
    if not Config.__contains__(ConfigProp_InitialPoints) or not isinstance(Config[ConfigProp_InitialPoints],int):
        messages.append("ConfigProp_InitialPoints should be a positive number")
    if not Config.__contains__(ConfigProp_LevelPointsDifference) or not isinstance(Config[ConfigProp_LevelPointsDifference], int):
        messages.append("ConfigProp_LevelPointsDifference should be a positive number")
    if not Config.__contains__(ConfigProp_KfactorIsDynamic) or not isinstance(Config[ConfigProp_KfactorIsDynamic], bool):
        messages.append("ConfigProp_KfactorIsDynamic should be True or False")
    if not Config.__contains__(ConfigProp_UseCustomInitialPoints) or not isinstance(Config[ConfigProp_UseCustomInitialPoints], bool):
        messages.append("ConfigProp_UseCustomInitialPoints should be True or False")
    if not Config.__contains__(ConfigProp_SkipDoubles) or not isinstance(Config[ConfigProp_SkipDoubles], bool):
        messages.append("ConfigProp_SkipDoubles should be True or False")

    return messages


class MatchScore:
    def __init__(self):
        self.is_valid_match = True
        self.is_valid_tiebreak = True
        self.is_complete_match = False
        self.is_complete_tiebreak = False
        self.is_empty = True
        self.valid_sets = []
        self.player1_sets = []
        self.player2_sets = []
        self.player1_games_balance = 0
        self.player2_games_balance = 0
        self.raw = ''
        self.raw_reverse = ''
        self.messages = []

    def __str__(self):
        return u'Match Score: valid={} completed={} empty={} sets={} p1_sets={} p2sets={} errors={}'.format(self.is_valid_match, self.is_complete_match,
                self.is_empty, len(self.valid_sets), len(self.player1_sets), len(self.player2_sets), ' | '.join(self.messages))


def parse_score(score):
    match_score = MatchScore()
    reverse = []

    try:
        match_score.raw = score
        if score is not None and score.__str__().strip() != '':
            sets = score.strip().split(' ')
            has_short_sets = False

            for set_string in sets:
                if not match_score.is_valid_match and not match_score.is_valid_tiebreak:
                    break

                if len(match_score.valid_sets) > 0:
                    match_score.is_valid_tiebreak = False

                    if len(match_score.player1_sets) == 0 and len(match_score.player2_sets) == 0:
                        match_score.is_valid_match = False

                is_first_set = len(match_score.player1_sets) == 0 and len(match_score.player2_sets) == 0

                split_points = [x for x in set_string.split('-') if re.match('^\d\d?$', x) is not None]

                if len(split_points) != 2:
                    match_score.is_valid_match = False
                    match_score.is_valid_tiebreak = False
                    match_score.messages.append('split point not equal 2 or illegal')
                    reverse.append(set_string)
                    break
                else:
                    player1_points = int(split_points[0])
                    player2_points = int(split_points[1])

                    if ((player1_points > 7 or
                         (player1_points == 7 and player2_points < 5) or
                         player2_points > 7 or
                         (player2_points == 7 and player1_points < 5)) and (len(match_score.valid_sets) < 2) or
                        ((len(match_score.player1_sets) == 2 and not has_short_sets) or
                         len(match_score.player1_sets) == 3 or
                         (len(match_score.player2_sets) == 2 and not has_short_sets) or
                         len(match_score.player2_sets) == 3) or
                            (has_short_sets and (player1_points > 4 or player2_points > 4))):
                        match_score.is_valid_match = False

                    match_score.valid_sets.append(set_string)
                    match_score.is_empty = False
                    reverse.append(split_points[1] + '-' + split_points[0])

                    if (player1_points == 6 and player2_points < 5) or (player1_points == 7 and (player2_points == 5 or player2_points == 6)):
                        match_score.player1_sets.append(set_string)
                        match_score.player1_games_balance += (player1_points - player2_points)
                        match_score.player2_games_balance += (player2_points - player1_points)
                    elif (player2_points == 6 and player1_points < 5) or (player2_points == 7 and (player1_points == 5 or player1_points == 6)):
                        match_score.player2_sets.append(set_string)
                        match_score.player1_games_balance += (player1_points - player2_points)
                        match_score.player2_games_balance += (player2_points - player1_points)
                    elif player1_points >= 10 and player1_points - player2_points >= 2:
                        match_score.player1_sets.append(set_string)
                        match_score.player1_games_balance += 1
                        match_score.player2_games_balance -= 1
                    elif player2_points >= 10 and player2_points - player1_points >= 2:
                        match_score.player2_sets.append(set_string)
                        match_score.player1_games_balance -= 1
                        match_score.player2_games_balance += 1
                    elif player1_points == 4 and player2_points < 4 and (is_first_set or has_short_sets):
                        has_short_sets = True
                        match_score.player1_sets.append(set_string)
                        match_score.player1_games_balance += (player1_points - player2_points)
                        match_score.player2_games_balance -= (player1_points - player2_points)
                    elif player1_points < 4 and player2_points == 4 and (is_first_set or has_short_sets):
                        has_short_sets = True
                        match_score.player2_sets.append(set_string)
                        match_score.player1_games_balance += (player1_points - player2_points)
                        match_score.player2_games_balance -= (player1_points - player2_points)

            if match_score.is_valid_match and (len(match_score.player1_sets) + len(match_score.player2_sets) == len(match_score.valid_sets)):
                if ((len(match_score.valid_sets) in [2, 3] and
                     not has_short_sets) and
                        (len(match_score.player1_sets) == 2 or len(match_score.player2_sets) == 2)):
                    match_score.is_complete_match = True
                elif (len(match_score.valid_sets) in [3, 4, 5] and
                      has_short_sets and
                      (len(match_score.player1_sets) == 3 or len(match_score.player2_sets) == 3)):
                    match_score.is_complete_match = True
                # printMessage('p1Sets = {}, p2Sets = {}, complete = {}'.format(len(match_score.player1_sets), len(match_score.player2_sets), match_score.is_complete_match))

            elif (match_score.is_valid_tiebreak and
                  len(match_score.valid_sets) == 1 and
                  len(match_score.player1_sets) + len(match_score.player2_sets) == 1):
                match_score.is_complete_tiebreak = True
    except:
        match_score.is_valid_match = False
        match_score.is_valid_tiebreak = False

    match_score.raw_reverse = ' '.join(reverse)
    return match_score


def setInitialPointsByLevel():
    pointsForLevel = Config[ConfigProp_InitialPoints]

    for level in Levels:
        InitPointsByLevelDict[level] = pointsForLevel
        pointsForLevel += Config[ConfigProp_LevelPointsDifference]


def getProbability(ranking_player, ranking_opponent):
    probability = float(1)/(1+10**(float(ranking_opponent - ranking_player)/250))
    return probability


def getTeamsKfactors(team1Id, team2Id):
    kFactorP1 = kFactorP2 = Config[ConfigProp_DefaultKfactor]

    if Config[ConfigProp_KfactorIsDynamic]:
        matchesPlayedP1 = 0 if team1Id not in matchesPlayedSinglesDict else len(matchesPlayedSinglesDict[team1Id])
        matchesPlayedP2 = 0 if team2Id not in matchesPlayedSinglesDict else len(matchesPlayedSinglesDict[team2Id])

        if team1Id in matchesPlayedDoublesDict:
            matchesPlayedP1 += len(matchesPlayedDoublesDict[team1Id])

        if team2Id in matchesPlayedDoublesDict:
            matchesPlayedP2 += len(matchesPlayedDoublesDict[team2Id])

        kFactorP1 = float(250) / ((matchesPlayedP1 + 5) ** 0.4)
        kFactorP2 = float(250) / ((matchesPlayedP2 + 5) ** 0.4)

    return (kFactorP1, kFactorP2)


def getPointsDifferenceCoef(team1Points, team2Points):
    coef = 1.0

    if Config[ConfigProp_UsePointsDifferenceCoef]:
        difference = abs(team1Points - team2Points)
        if difference in (0, 50):
           coef = 0.5
        elif difference in (50, 100):
           coef = 0.4
        elif difference in (100, 200):
           coef = 0.3
        elif difference > 200:
           coef = 0.1
           
    return coef


def getMatchResultCoef(score):
    coef = 1.0
    parsedScore = parse_score(score)
    setsAbs = abs(len(parsedScore.player1_sets) - len(parsedScore.player2_sets))

    if parsedScore.is_complete_match and setsAbs == 1:
        coef = 1/1.6
        # print('match result 2:1 or 3:2 coef = {}'.format(coef))
    elif parsedScore.is_complete_match and len(parsedScore.valid_sets) > 3 and setsAbs == 2:
        coef = 1/1.5
        # print('match result 3:1 coef = {}'.format(coef))
        
    return coef


def convertToInt(value):
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
        "initPoints": convertToInt(getCsvValueFromColumn(rowData, columnsPlayers, 'init_points'))
    }

    # print(playerInfo["initPoints"])

    if playerInfo["level"] == '':
        playerInfo["level"] = 1

    playerId = playerInfo["playerId"]
    playersDict[playerId] = playerInfo
    pointsDict[playerId] = InitPointsByLevelDict[int(playerInfo["level"])] if not Config[ConfigProp_UseCustomInitialPoints] else playerInfo["initPoints"]
    winsDict[playerId] = 0
    lossesDict[playerId] = 0
    winsDoublesDict[playerId] = 0
    lossesDoublesDict[playerId] = 0
    playersPointsHistoryDict[playerId] = []

    matchesPlayedSinglesDict[playerId] = []
    matchesPlayedDoublesDict[playerId] = []


def preActionMatches(row):
    values = row[0].split(';')
    comment = values[Col_Comment]
    date = datetime.datetime.strptime(values[Col_StartDate], '%Y-%m-%d')
    player3Id = values[Col_Player3Id]
    player4Id = values[Col_Player4Id]
    isDoubles = len(player3Id) > 0

    if len(comment) > 0 or (isDoubles and Config[ConfigProp_SkipDoubles]) > 0:
        return

    player1Id = values[Col_Player1Id]
    player2Id = values[Col_Player2Id]

    if isDoubles:
        if player1Id in matchesPlayedDoublesDict:
            matchesPlayedDoublesDict[player1Id].append(date)

        if player2Id in matchesPlayedDoublesDict:
            matchesPlayedDoublesDict[player2Id].append(date)

        if player3Id in matchesPlayedDoublesDict:
            matchesPlayedDoublesDict[player3Id].append(date)

        if player4Id in matchesPlayedDoublesDict:
            matchesPlayedDoublesDict[player4Id].append(date)
    else:
        if player1Id in matchesPlayedSinglesDict:
            matchesPlayedSinglesDict[player1Id].append(date)

        if player2Id in matchesPlayedSinglesDict:
            matchesPlayedSinglesDict[player2Id].append(date)


def actionMatches(row):
    # print(row)
    values = row[0].split(';')
    comment = values[Col_Comment]
    matchDate = values[Col_StartDate]
    player1Id = values[Col_Player1Id]
    player2Id = values[Col_Player2Id]
    player3Id = values[Col_Player3Id]
    player4Id = values[Col_Player4Id]

    isDoubles = len(player3Id) > 0

    if not playersDict.__contains__(player1Id) or not playersDict.__contains__(player2Id) \
      or (isDoubles and (not playersDict.__contains__(player3Id) or not playersDict.__contains__(player4Id))):
        return

    if len(comment) > 0 or (isDoubles and Config[ConfigProp_SkipDoubles]):
        # print("retired or doubles : '{}'".format(player3Id))
        return
        
    score = values[Col_Score]
    winnerId = values[Col_WinnerId]

    if isDoubles:
        team1Points = pointsDict[player1Id] + pointsDict[player2Id]
        team2Points = pointsDict[player3Id] + pointsDict[player4Id]
        team1Id = player1Id + DoublesTeamIdSeparator + player2Id
        team1IsWinner = team1Id == winnerId
    else:
        team1IsWinner = player1Id == winnerId
        team1Points = pointsDict[player1Id]
        team2Points = pointsDict[player2Id]

    
    coefMatchResult = getMatchResultCoef(score)
    # coefPointsDifference = getPointsDifferenceCoef(pointsDict[player1Id], pointsDict[player2Id])

    kFactorsTuple = getTeamsKfactors(player1Id, player2Id)

    winProbabilityTeam1 = getProbability(team1Points, team2Points)
    
    # print("")
    # print("P1 = {}, P2 = {}, P3 = {}, P4 = {}".format(player1Id, player2Id, player3Id, player4Id))
    # print("Score = {}, Rank: {}, {}, Probability: {}, {}".format(score, team1Points, team2Points, winProbabilityTeam1, 1- winProbabilityTeam1))


    deltaTeam1Wins = int(coefMatchResult * kFactorsTuple[0] * (1 - winProbabilityTeam1))
    deltaTeam1Loses = int(coefMatchResult * kFactorsTuple[0] * winProbabilityTeam1)
    team1Player1Ratio = 0 if not isDoubles else float(pointsDict[player1Id]/team1Points)
    
    deltaTeam2Wins = int(coefMatchResult * kFactorsTuple[1] * winProbabilityTeam1)
    deltaTeam2Loses = int(coefMatchResult * kFactorsTuple[1] * (1 - winProbabilityTeam1))
    team2Player1Ratio = 0 if not isDoubles else float(pointsDict[player3Id]/team2Points)

    # print("Delta P1: {}, {}, Delta P2: {}, {}".format(deltaTeam1Wins, deltaTeam1Loses, deltaTeam2Wins, deltaTeam2Loses))

    p1Delta = 0
    p2Delta = 0
    p3Delta = 0
    p4Delta = 0

    if team1IsWinner:
        if isDoubles:
            p1Delta = int(deltaTeam1Wins / 2)
            p2Delta = int(deltaTeam1Wins / 2)
            p3Delta = -int(deltaTeam2Loses / 2)
            p4Delta = -int(deltaTeam2Loses / 2)
            winsDoublesDict[player1Id] += 1
            winsDoublesDict[player2Id] += 1
            lossesDoublesDict[player3Id] += 1
            lossesDoublesDict[player4Id] += 1

        else:
            p1Delta = deltaTeam1Wins
            p2Delta = -deltaTeam2Loses
            winsDict[player1Id] += 1
            lossesDict[player2Id] += 1

    else:
        if isDoubles:
            p1Delta = -int(deltaTeam1Wins / 2)
            p2Delta = -int(deltaTeam1Wins / 2)
            p3Delta = int(deltaTeam2Loses / 2)
            p4Delta = int(deltaTeam2Loses / 2)
            winsDoublesDict[player3Id] += 1
            winsDoublesDict[player4Id] += 1
            lossesDoublesDict[player1Id] += 1
            lossesDoublesDict[player2Id] += 1

        else:
            p1Delta = -deltaTeam1Loses
            p2Delta = deltaTeam2Wins
            winsDict[player2Id] += 1
            lossesDict[player1Id] += 1

    pointsDict[player1Id] += p1Delta
    pointsDict[player2Id] += p2Delta
    playersPointsHistoryDict[player1Id].append("{}: {}".format(matchDate, p1Delta))
    playersPointsHistoryDict[player2Id].append("{}: {}".format(matchDate, p2Delta))

    if isDoubles:
        pointsDict[player3Id] += p3Delta
        pointsDict[player4Id] += p4Delta
        playersPointsHistoryDict[player3Id].append("{}: {}".format(matchDate, p3Delta))
        playersPointsHistoryDict[player4Id].append("{}: {}".format(matchDate, p4Delta))

    if not isDoubles and Config[ConfigProp_PontsForMatchPlayed] is not None and Config[ConfigProp_PontsForMatchPlayed] > 0:
        pointsDict[player1Id] += Config[ConfigProp_PontsForMatchPlayed]
        pointsDict[player2Id] += Config[ConfigProp_PontsForMatchPlayed]


def getLevelDisplay(levelId):
    levelId = int(levelId)
    levelDisplay = 'Undefined Level'
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
    elif levelId == 5:
        levelDisplay = 'S-Masters'
    elif levelId == -1:
        levelDisplay = 'Sattelite'

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
    
    fCsv = open(fileName + fileNameSuffix + ".csv", "a")
    fCsv.seek(0)
    fCsv.truncate()

    initPointsStat = ""
    for level in InitPointsByLevelDict:
        initPointsStat += getLevelDisplay(level) + ": " + str(InitPointsByLevelDict[level]) + ", "

    f.write("{} = {}\n".format(getColumnData("Initial Points", 20), initPointsStat if not Config[ConfigProp_UseCustomInitialPoints] else 'Custom'))
    f.write("{} = {}\n\n".format(getColumnData("Kfactor", 20), Config[ConfigProp_DefaultKfactor]))
        
    columnSeparator = " | "
    columnSeparatorCsv = ";"
    newLine = "\n"

    resultColumns = [
        getColumnData('#', 4),
        getColumnData('singles stat', 14),
        getColumnData('doubles stat', 14),
        getColumnData('lvl', 10),
        getColumnData('last date', 12),
        getColumnData('hidden', 8),
        getColumnData('ID', 7),
        getColumnData('pts', 6),
        getColumnData('name', 30),
        'history'
    ]

    columnsString = ""
    columnsStringCsv = ""
    for idx, colName in enumerate(resultColumns):
        columnsString += colName + (columnSeparator if idx < len(resultColumns) - 1 else newLine)
        columnsStringCsv += colName.strip() + (columnSeparatorCsv if idx < len(resultColumns) - 1 else newLine)

    f.write(columnsString)
    fCsv.write(columnsStringCsv)

    index = 0

    for t in sortedPoints:
        playerId = t[0]
        isHidden = True
        lastMatchDate = "n/a"
        
        allMatchesPlayedDates = matchesPlayedSinglesDict[playerId]
        matchesInLast183days = 0
        
        for matchDate in allMatchesPlayedDates:
            lastMatchDate = matchDate.strftime("%Y-%m-%d")
            if matchDate + datetime.timedelta(days=183) > datetime.datetime.now():
                matchesInLast183days += 1

        if matchesInLast183days >= 5:
            isHidden = False

        index += 1

        playerInfo = playersDict[playerId]
        points = t[1]
        fullName = playerInfo["firstName"] + " " + playerInfo["lastName"]
        level = playerInfo["level"]
        singlesStats = "{}.{}.{}.{}".format(len(matchesPlayedSinglesDict[playerId]), winsDict[playerId], lossesDict[playerId], winsDict[playerId] - lossesDict[playerId])
        doublesStats = "{}.{}.{}.{}".format(len(matchesPlayedDoublesDict[playerId]), winsDoublesDict[playerId], lossesDoublesDict[playerId], winsDoublesDict[playerId] - lossesDoublesDict[playerId])
        history = ' - '.join(playersPointsHistoryDict[playerId])

        resultValues = [
            getColumnData(index, 4),
            getColumnData(singlesStats, 14),
            getColumnData(doublesStats, 14),
            getColumnData(getLevelDisplay(level), 10),
            getColumnData(lastMatchDate, 12),
            getColumnData(isHidden, 8),
            getColumnData(playerId, 7),
            getColumnData(points, 6),
            getColumnData(fullName, 30),
            history
        ]

        resultValuesString = ""
        resultValuesStringCsv = ""

        for idx, valString in enumerate(resultValues):
            resultValuesString += valString + (columnSeparator if idx < len(resultValues) - 1 else newLine)
            resultValuesStringCsv += valString.strip() + (columnSeparatorCsv if idx < len(resultValues) - 1 else newLine)

        f.write(resultValuesString)

        # resultValuesStringCsv = resultValuesStringCsv.decode("utf-8")
        # resultValuesStringCsv = resultValuesStringCsv.encode("ascii", "ignore")
        fCsv.write(resultValuesStringCsv)

    f.close()
    fCsv.close()


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


messages = validateConfig()
if len(messages) > 0:
    output = "Configuration Error(s) detected:"

    for message in messages:
        output += " -" + message + "\n"

    raise Exception(output)
    

setInitialPointsByLevel()

dataSetPlayers = pd.read_csv(r'players.csv')
columnsPlayers = getCsvColumns(dataSetPlayers)
dataSetPlayers.apply(actionPlayers, axis=1)

dataSetMatches = pd.read_csv(r'matches_2022.csv')
dataSetMatches.apply(preActionMatches, axis=1)

dataSetMatches.apply(actionMatches, axis=1)

sortedPoints = sorted(pointsDict.items(), key=operator.itemgetter(1), reverse=True)

writeRankingsToFile("Points")
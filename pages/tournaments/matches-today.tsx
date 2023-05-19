import type { NextPage } from 'next';
import { useState } from 'react';
import { prisma } from 'services/db';
import { IMatch, TypeGroupedMatches } from 'Interfaces/IMatchesToday'
import { MATCHES_TABS_MAIN, LEVELS_TABS } from 'constants/values'

import Tabs from 'ui-kit/Tabs';
import NotFoundMessage from 'ui-kit/NotFoundMessage';
import TournamentMatchLive from 'components/tournamentMatchLive/TournamentMatchLive';
import styles from 'styles/MatchesToday.module.scss';


interface IMatchesProps {
    matchesToday: IMatch[];
    matchesTomorrow: IMatch[];
}

const MatchesToday: NextPage<IMatchesProps> = ({
    matchesToday, matchesTomorrow
}) => {
    const [tabMain, setTabMain] = useState<string>(MATCHES_TABS_MAIN[0]);
    const [activeTabLevel, setActiveTabLevel] = useState<string>(LEVELS_TABS[0]);

    const handleTabChangeMain = (_: any, value: number) => {
        setTabMain(MATCHES_TABS_MAIN[value]);
    };

    const handleTabChange = (_: any, value: number) => {
        setActiveTabLevel(LEVELS_TABS[value]);
    };

    const filterAndSortMatches = (
        matches: IMatch[], 
        tournamentTypes: number[], 
        tournamentLevel: number
    ): [string, IMatch[]][] => {
        let filteredMatches;

        if (tournamentTypes.length > 0) {
            filteredMatches = matches.filter(t => tournamentTypes.includes(t.tournament.tournament_type)
                || (t.tournament.tournament_type === 0 && t.tournament.tournament_level === tournamentLevel)
                || (t.tournament.tournament_type === 7 && t.tournament.tournament_level === tournamentLevel)
                || (t.tournament.tournament_type === 23 && t.tournament.tournament_level === tournamentLevel)
                || (t.tournament.tournament_type === 100 && t.tournament.tournament_level === tournamentLevel)
            );
        } else {
            filteredMatches = matches;
        }

        const groupedMatches = filteredMatches.reduce((acc: TypeGroupedMatches, match: IMatch) => {
            const tournamentId = match.tournament.id;
            if (acc[tournamentId]) {
                acc[tournamentId].push(match);
            } else {
                acc[tournamentId] = [match];
            }
            return acc;
        }, {});

        return Object.entries(groupedMatches).sort((a, b) => {
            const tournamentTypeA = a[1][0].tournament.tournament_type;
            const tournamentTypeB = b[1][0].tournament.tournament_type;
            return tournamentTypeA - tournamentTypeB;
        });
    };

    const activeTabMain = tabMain === MATCHES_TABS_MAIN[0] ? 1 : 2;
    const activeMatches = tabMain === MATCHES_TABS_MAIN[0] ? matchesToday : matchesTomorrow;

    const activeTabContent = (() => {
        switch (activeTabLevel) {
            case LEVELS_TABS[0]:
                const matches0 = filterAndSortMatches(activeMatches, [], 0);
                if (matches0.length === 0) {
                    return <NotFoundMessage message="Нет матчей в расписании!" />;
                }
                    return <TournamentMatchLive sortedGroupedMatches={matches0} />;

            case LEVELS_TABS[1]:
                const matches1 = filterAndSortMatches(activeMatches, [5, 12, 13], 1);
                if (matches1.length === 0) {
                    return <NotFoundMessage message="Нет матчей в расписании!" />;
                }
                    return <TournamentMatchLive sortedGroupedMatches={matches1} />;

            case LEVELS_TABS[2]:
                const matches2 = filterAndSortMatches(activeMatches, [4, 14], 2);
                if (matches2.length === 0) {
                    return <NotFoundMessage message="Нет матчей в расписании!" />;
                }
                    return <TournamentMatchLive sortedGroupedMatches={matches2} />;

            case LEVELS_TABS[3]:
                const matches3 = filterAndSortMatches(activeMatches, [6, 15], 3);
                if (matches3.length === 0) {
                    return <NotFoundMessage message="Нет матчей в расписании!" />;
                }
                    return <TournamentMatchLive sortedGroupedMatches={matches3} />;
        
            case LEVELS_TABS[4]:
                const matches4 = filterAndSortMatches(activeMatches, [3, 18], 4);
                if (matches4.length === 0) {
                    return <NotFoundMessage message="Нет матчей в расписании!" />;
                }
                    return <TournamentMatchLive sortedGroupedMatches={matches4} />;
        
            case LEVELS_TABS[5]:
                const matches5 = filterAndSortMatches(activeMatches, [2, 20], 5);
                if (matches5.length === 0) {
                    return <NotFoundMessage message="Нет матчей в расписании!" />;
                }
                    return <TournamentMatchLive sortedGroupedMatches={matches5} />;
        
            case LEVELS_TABS[6]:
                const matches6 = filterAndSortMatches(activeMatches, [11, 101], 6);
                if (matches6.length === 0) {
                    return <NotFoundMessage message="Нет матчей в расписании!" />;
                }
                    return <TournamentMatchLive sortedGroupedMatches={matches6} />;
        
            case LEVELS_TABS[7]:
                const matches7 = filterAndSortMatches(activeMatches, [1, 22], 7);
                if (matches7.length === 0) {
                    return <NotFoundMessage message="Нет матчей в расписании!" />;
                }
                    return <TournamentMatchLive sortedGroupedMatches={matches7} />;
        
            default:
                return <NotFoundMessage message="Нет матчей в расписании!" />;
        }
    })();

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                < Tabs tabNames={MATCHES_TABS_MAIN} activeTab={tabMain} onChange={handleTabChangeMain} />
                {
                    activeTabMain === 1 && (
                        <>
                            < Tabs tabNames={LEVELS_TABS} activeTab={activeTabLevel} onChange={handleTabChange} />
                            {activeTabContent}
                        </>
                    )
                }
                {
                    activeTabMain === 2 && (
                        <>
                            < Tabs tabNames={LEVELS_TABS} activeTab={activeTabLevel} onChange={handleTabChange} />
                            {activeTabContent}
                        </>
                    )
                }
            </div>
        </div>
    )
}

export const getStaticProps = async () => {

    const startOfToday: Date = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday: Date = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfTomorrow: Date = new Date();
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    startOfTomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow: Date = new Date();
    endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const matchesTodayArray = await prisma.match.findMany({
        where: {
            time: {
                gte: startOfToday,
                lte: endOfToday,
            },
        },
        select: {
            id: true,
            tournament_id: true,
            player1_id: true,
            player2_id: true,
            player3_id: true,
            player4_id: true,
            score: true,
            time: true,
            winner_id: true,
            youtube_link: true,
        },
    });

    const matchesTomorrowArray = await prisma.match.findMany({
        where: {
            time: {
                gte: startOfTomorrow,
                lte: endOfTomorrow,
            },
        },
        select: {
            id: true,
            tournament_id: true,
            player1_id: true,
            player2_id: true,
            player3_id: true,
            player4_id: true,
            score: true,
            time: true,
            winner_id: true,
            youtube_link: true,
        },
    });

    const tournamentsIdToday: number[] = matchesTodayArray.map(match => match.tournament_id as number);
    const tournamentsIdTomorrow: number[] = matchesTomorrowArray.map(match => match.tournament_id as number);
    const tournamentsToday = await prisma.tournament.findMany({
        where: {
            id: {
                in: tournamentsIdToday,
            },
        },
        select: {
            id: true,
            name: true,
            tournament_type: true,
            tournament_level: true,
        },
    });

    const tournamentsTomorrow = await prisma.tournament.findMany({
        where: {
            id: {
                in: tournamentsIdTomorrow,
            },
        },
        select: {
            id: true,
            name: true,
            tournament_type: true,
            tournament_level: true,
        },
    });
    
    const playersIdToday = new Set<number>();
    const playersIdTomorrow = new Set<number>();

    matchesTodayArray.forEach((match) => {
        if (match.player1_id !== null) playersIdToday.add(match.player1_id);
        if (match.player2_id !== null) playersIdToday.add(match.player2_id);
        if (match.player3_id !== null) playersIdToday.add(match.player3_id);
        if (match.player4_id !== null) playersIdToday.add(match.player4_id);
    });

    matchesTomorrowArray.forEach((match) => {
        if (match.player1_id !== null) playersIdTomorrow.add(match.player1_id);
        if (match.player2_id !== null) playersIdTomorrow.add(match.player2_id);
        if (match.player3_id !== null) playersIdTomorrow.add(match.player3_id);
        if (match.player4_id !== null) playersIdTomorrow.add(match.player4_id);
    });
    

    const playersToday = await prisma.player.findMany({
        where: {
            id: {
                in: Array.from(playersIdToday),
            },
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
        },
    });

    const playersTomorrow = await prisma.player.findMany({
        where: {
            id: {
                in: Array.from(playersIdTomorrow),
            },
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
        },
    });

    const matchesToday = matchesTodayArray.map((match) => {
        const tournament = tournamentsToday.find((tournament) => tournament.id === match.tournament_id);
        const player1 = playersToday.find((player) => player.id === match.player1_id);
        const player2 = playersToday.find((player) => player.id === match.player2_id);
        const player3 = playersToday.find((player) => player.id === match.player3_id);
        const player4 = playersToday.find((player) => player.id === match.player4_id);
    
        return {
            id: match.id,
            time: match.time,
            score: match.score,
            winner_id: match.winner_id,
            youtube_link: match.youtube_link,
            tournament,
            player1,
            player2,
            player3,
            player4,
        };
    });

    const matchesTomorrow = matchesTomorrowArray.map((match) => {
        const tournament = tournamentsTomorrow.find((tournament) => tournament.id === match.tournament_id);
        const player1 = playersTomorrow.find((player) => player.id === match.player1_id);
        const player2 = playersTomorrow.find((player) => player.id === match.player2_id);
        const player3 = playersTomorrow.find((player) => player.id === match.player3_id);
        const player4 = playersTomorrow.find((player) => player.id === match.player4_id);

        return {
            id: match.id,
            time: match.time,
            score: match.score,
            winner_id: match.winner_id,
            youtube_link: match.youtube_link,
            tournament,
            player1,
            player2,
            player3,
            player4,
        };
    });
    
    return {
        props: {
            matchesToday,
            matchesTomorrow,
        },
        revalidate: 600,
    };
};

export default MatchesToday;
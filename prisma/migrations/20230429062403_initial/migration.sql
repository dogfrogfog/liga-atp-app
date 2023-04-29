-- CreateTable
CREATE TABLE "match" (
    "id" SERIAL NOT NULL,
    "tournament_id" INTEGER,
    "player1_id" INTEGER,
    "player2_id" INTEGER,
    "comment" TEXT,
    "is_completed" BOOLEAN,
    "stage" INTEGER,
    "start_date" DATE,
    "winner_id" TEXT,
    "score" TEXT,
    "player3_id" INTEGER,
    "player4_id" INTEGER,
    "youtube_link" TEXT,
    "time" TIMESTAMP(6),

    CONSTRAINT "idx_16888_match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "date_of_birth" DATE,
    "city" TEXT,
    "country" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "avatar" TEXT,
    "level" INTEGER,
    "age" INTEGER,
    "gameplay_style" TEXT,
    "forehand" TEXT,
    "beckhand" TEXT,
    "insta_link" TEXT,
    "is_coach" BOOLEAN,
    "in_tennis_from" DATE,
    "job_description" TEXT,
    "technique" INTEGER NOT NULL DEFAULT 0,
    "tactics" INTEGER NOT NULL DEFAULT 0,
    "power" INTEGER DEFAULT 0,
    "shakes" INTEGER NOT NULL DEFAULT 0,
    "serve" INTEGER NOT NULL DEFAULT 0,
    "behaviour" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER,
    "premium" BOOLEAN DEFAULT false,

    CONSTRAINT "idx_16917_core_player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "address" TEXT,
    "start_date" DATE,
    "is_finished" BOOLEAN,
    "surface" INTEGER,
    "draw_type" INTEGER,
    "players_order" TEXT,
    "draw" TEXT,
    "city" TEXT,
    "tournament_type" INTEGER,
    "is_doubles" BOOLEAN,
    "status" INTEGER,
    "unregistered_players" TEXT DEFAULT '',

    CONSTRAINT "idx_16929_core_tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digest" (
    "id" SERIAL NOT NULL,
    "date" DATE,
    "markdown" TEXT,
    "title" TEXT,
    "mentioned_players_ids" INTEGER[],

    CONSTRAINT "digest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_elo_ranking" (
    "id" SERIAL NOT NULL,
    "elo_points" INTEGER,
    "player_id" INTEGER,
    "expire_date" DATE,

    CONSTRAINT "player_elo_ranking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elo_ranking_change" (
    "id" SERIAL NOT NULL,
    "player_id" INTEGER,
    "match_id" INTEGER,
    "change_date" DATE,
    "current_elo_points" INTEGER,
    "new_elo_points" INTEGER,

    CONSTRAINT "elo_ranking_change_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "other_page" (
    "id" SERIAL NOT NULL,
    "markdown" TEXT,
    "slug" TEXT,
    "title" TEXT,

    CONSTRAINT "other_page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_16888_core_match_26d85d6c" ON "match"("player1_id");

-- CreateIndex
CREATE INDEX "idx_16888_core_match_656a3fdb" ON "match"("tournament_id");

-- CreateIndex
CREATE INDEX "idx_16888_core_match_6bbfd55d" ON "match"("player3_id");

-- CreateIndex
CREATE INDEX "idx_16888_core_match_863818d8" ON "match"("player2_id");

-- CreateIndex
CREATE INDEX "idx_16888_core_match_9c006b3a" ON "match"("player4_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_elo_ranking_player_id_key" ON "player_elo_ranking"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "other_page_slug_key" ON "other_page"("slug");

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "core_match_player1_id_fkey" FOREIGN KEY ("player1_id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "core_match_player2_id_fkey" FOREIGN KEY ("player2_id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "core_match_player3_id_fkey" FOREIGN KEY ("player3_id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "core_match_player4_id_fkey" FOREIGN KEY ("player4_id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "core_match_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

import { Anime } from '@/types/anime';
import React from 'react'
import AnimeInfoCard from '../AnimeInfoCard';
import { Award, Calendar, Clock, Heart, Play, Users } from 'lucide-react';

const AnimeInfoCardGroup = ({ anime }: { anime: Anime }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
    <AnimeInfoCard
      icon={Calendar}
      cardTitle="Aired"
      cardDescription={anime.aired.string}
    />
    <AnimeInfoCard
      icon={Clock}
      cardTitle="Duration"
      cardDescription={anime.duration}
    />
    <AnimeInfoCard
      icon={Play}
      cardTitle="Episodes"
      cardDescription={anime.episodes > 0 ? anime.episodes.toString() : "N/A"}
    />
    <AnimeInfoCard
      icon={Users}
      cardTitle="Members"
      cardDescription={anime.members.toLocaleString()}
    />
    <AnimeInfoCard
      icon={Award}
      cardTitle="Rank"
      cardDescription={anime.rank > 0 ? `#${anime.rank}` : "N/A"}
    />
    <AnimeInfoCard
      icon={Heart}
      cardTitle="Favorites"
      cardDescription={anime.favourites.toLocaleString()}
    />
  </div>
);

export default AnimeInfoCardGroup
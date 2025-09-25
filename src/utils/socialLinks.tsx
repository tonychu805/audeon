import React from 'react';
import {
  FaLinkedin,
  FaTwitter,
  FaMedium,
  FaGithub,
  FaGlobe,
  FaNewspaper,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaSlack,
  FaDiscord,
} from 'react-icons/fa';

interface IconOptions {
  size?: number;
  className?: string;
}

const mergeClasses = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(' ');

export const getSocialPlatformIcon = (
  platform: string,
  { size = 16, className = 'text-gray-600' }: IconOptions = {}
) => {
  const styled = (extra?: string) => mergeClasses(className, extra);

  switch (platform.toLowerCase()) {
    case 'linkedin':
      return <FaLinkedin size={size} className={styled('text-blue-600')} />;
    case 'twitter':
    case 'x':
      return <FaTwitter size={size} className={styled('text-sky-500')} />;
    case 'medium':
      return <FaMedium size={size} className={styled('text-gray-900')} />;
    case 'substack':
    case 'beehiiv':
      return <FaNewspaper size={size} className={styled('text-orange-500')} />;
    case 'github':
      return <FaGithub size={size} className={styled('text-gray-900')} />;
    case 'youtube':
      return <FaYoutube size={size} className={styled('text-red-600')} />;
    case 'facebook':
      return <FaFacebook size={size} className={styled('text-blue-500')} />;
    case 'instagram':
      return <FaInstagram size={size} className={styled('text-pink-600')} />;
    case 'slack':
      return <FaSlack size={size} className={styled('text-purple-500')} />;
    case 'discord':
      return <FaDiscord size={size} className={styled('text-indigo-500')} />;
    case 'website':
    case 'home':
    case 'site':
    default:
      return <FaGlobe size={size} className={styled()} />;
  }
};

import { IoMdBook, IoIosStats } from 'react-icons/io'
import { BiDumbbell } from 'react-icons/bi'
import { AiOutlineHome } from 'react-icons/ai'
import { useLocation, Link } from 'react-router-dom'
import {
  HOME_PATH,
  STORIES_HOME_PATH,
  EXERCISES_PATH,
  STATISTICS_PATH
} from '../../paths'
import { IconBaseProps } from 'react-icons/lib'
import {
  BooksImage,
  DumbbellImage,
  HomeImage,
  StatsImage
} from './images'
import { FC } from 'react'

import './Navbar.scss'

interface NavbarLinkProps {
  Icon: FC<IconBaseProps>
  image: string
  name: string
  path: string
  className?: string
}

const NavbarLink = ({
  Icon,
  image,
  name,
  path,
  className
}: NavbarLinkProps) => {
  const { pathname } = useLocation()
  const navbarClassName = `navbar-li ${path === pathname ? 'selected-navbar-icon' : 'not-selected-navbar-icon'} ${className != null ? className : ''}`

  return (
        <li className={`${navbarClassName}`}>
            <Link to={path}>
                <img src={image} className='navbar-image' alt={name} />
                <Icon className='navbar-icon' />
                <span className='navbar-link-text'>{name}</span>
            </Link>
        </li>
  )
}

export const Navbar = () => {
  return (
        <ul className='navbar-container'>
            <NavbarLink
                Icon={AiOutlineHome}
                image={HomeImage}
                name='Home'
                path={HOME_PATH}
            />
            <NavbarLink
                Icon={IoMdBook}
                image={BooksImage}
                name='Stories'
                path={STORIES_HOME_PATH}
            />
            <NavbarLink
                Icon={BiDumbbell}
                image={DumbbellImage}
                name='Exercises'
                path={EXERCISES_PATH}
            />
            <NavbarLink
                Icon={IoIosStats}
                image={StatsImage}
                name='Statistics'
                path={STATISTICS_PATH}
                className='navbar-statistics-option'
            />
        </ul>
  )
}

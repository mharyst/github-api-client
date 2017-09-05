import {h} from 'preact'
import style from './style.scss'
import svg from './github.svg'

export const Logo = () => (
  <header class={style.logo}>
    <img src={svg} width={30}/>
    <h1>GitHub Client</h1>
  </header>
)

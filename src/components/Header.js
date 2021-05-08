import classes from './Header.module.css'

export const parentStyles = {
  paddingTop: 'calc(var(--basis_x8) + var(--basis_x4))'
}

export default function Header({ title, rightActions, notificationBanner }) {
  return <header className={classes.header}>
    <div className={classes.headerBar}>
      <h2>{title}</h2>
      {rightActions}
    </div>
    {
      !!notificationBanner
        ? <div className={classes.notificationBanner}>{notificationBanner}</div>
        : null
    }
  </header>
}

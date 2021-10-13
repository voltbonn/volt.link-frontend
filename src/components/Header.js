import classes from './Header.module.css'

export default function Header({ title, leftActions, rightActions, notificationBanner }) {
  return <header className={classes.header}>
    <div className={classes.headerBar}>
      {leftActions}
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

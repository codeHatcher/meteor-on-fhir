import React from 'react';
import classnames from 'classnames';
import style from './style';
import Header from '../../ui/components/Header';

const NavDrawer = (props) => {
  const rootClasses = classnames([style.navDrawer], {
    [style['permanent-' + props.permanentAt]]: props.permanentAt,
    [style.wide]: (props.width === 'wide'),
    [style.active]: props.active,
    [style.pinned]: props.pinned
  }, props.className);

  const drawerClasses = classnames(style.drawerContent, {
      [style.scrollY]: props.scrollY
  });

  return (
    <div data-react-toolbox='nav-drawer' className={rootClasses} onClick={props.onOverlayClick}>
      <div data-react-toolbox='nav-drawer-scrim' className={style.scrim}>
        <aside data-react-toolbox='nav-drawer-content' className={drawerClasses} style={{width: "28rem", maxWidth: "28rem", justifyContent: "flex-start"}} >
          {props.children}
        </aside>
      </div>
    </div>
  );
};

NavDrawer.propTypes = {
  active: React.PropTypes.bool,
  children: React.PropTypes.any,
  className: React.PropTypes.string,
  onOverlayClick: React.PropTypes.func,
  permanentAt: React.PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'xxl', 'xxxl']),
  pinned: React.PropTypes.bool,
  scrollY: React.PropTypes.bool,
  width: React.PropTypes.oneOf(['normal', 'wide'])
};

NavDrawer.defaultProps = {
  active: false,
  className: '',
  scrollY: false,
  width: 'normal'
};

export default NavDrawer;

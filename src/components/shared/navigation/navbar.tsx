import { SearchBar } from './search-bar';
import { UserMenu } from './user-menu';
import { AppSettings } from './app-settings';
import React from 'react';
import { DropdownMenu } from './dropdown-menu';
import { LinkButton } from '../link-button/link-button';
import { useQuery } from 'react-query';
import { fetchProfile } from '../../../api/user/fetch-profile';
import { Spinner } from '../spinner/spinner';

export const Navbar = (): JSX.Element => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openSettings, setOpenSettings] = React.useState(false);
  const [user, setUser] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const userQuery = useQuery('userProfile', fetchProfile);
  //while the query is loading, the userQuery.data is undefined

  React.useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
      setIsLoading(userQuery.isLoading);
    }
  }, [userQuery.data]);


  const openUserMenu = () => {
    setOpenMenu(!openMenu);
  };
  const openSettingsMenu = () => {
    setOpenSettings(!openSettings);
  };

  //if the query is loading, the userQuery.data is undefined
  //so the user object is empty


  return (
    isLoading ? <Spinner /> :
      (
        <div className={'absolute inline-flex  !justify-between items-center ' +
          'px-6  ml-20 left-0 right-0 shadow-2xl backdrop-blur-lg h-16 z-20 '}>
          <SearchBar />
          <div className={'flex relative !gap-x-5 '}>

            <div className={'relative flex'}>
              <AppSettings onClick={openSettingsMenu} isMenuOpen={openSettings} />
              {
                openSettings &&
                <DropdownMenu>
                  <LinkButton url={'/'} title={'Language'} icon={'🏁'} onClick={openSettingsMenu} />
                </DropdownMenu>
              }
            </div>
            <div className={'relative flex'}>

              <UserMenu user={user} onClick={() => {
                openUserMenu();
              }} />

              {openMenu &&
                <DropdownMenu>
                  <LinkButton url={'/profile'} title={'Profile'} icon={'🧑'} onClick={openUserMenu} />
                  <LinkButton url={'/settings'} title={'Settings'} icon={'⚙'} onClick={openUserMenu} />
                  <LinkButton url={'/logout'} title={'Logout'} icon={'📴'} onClick={openUserMenu} />
                </DropdownMenu>
              }
            </div>

          </div>


        </div>
      )
  );


};


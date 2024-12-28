import Navbar from '../components/navbar/Navbar';

const MainLayout = ({
  children,
  setCollapsed = () => {},
  setToggled = () => {},
  broken,
}) => {
  return (
    <div className="flex flex-col flex-1 h-full bg-white overflow-y-auto overflow-x-hidden relative">
      <Navbar
        broken={broken}
        setCollapsed={setCollapsed}
        setToggled={setToggled}
      />
      <div className="flex-1 h-full max-h-[100dvh]">{children}</div>
    </div>
  );
};

export default MainLayout;

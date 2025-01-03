import Navbar from '../components/navbar/Navbar';

const MainLayout = ({
  children,
  setCollapsed = () => {},
  setToggled = () => {},
  broken,
}) => {
  return (
    <div className="flex flex-col flex-1 h-full bg-white overflow-y-auto overflow-hidden relative">
      <Navbar
        broken={broken}
        setCollapsed={setCollapsed}
        setToggled={setToggled}
      />
      <div className="flex-1 h-full max-h-[calc(100dvh-64px)] mt-[64px] p-4 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;

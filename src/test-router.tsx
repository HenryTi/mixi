import { ReactNode, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useNavigation, useOutletContext } from 'react-router-dom';
import { proxy, useSnapshot } from 'valtio';
import 'tonwa-com/css/tonwa.css';
const testState = proxy({ count: 1 });

function A() {
    let a = useNavigate();
    let vAbout = <div className='cursor-pointer' onClick={() => a('/about')}>abount</div>;
    let [x, setX] = useState(0);
    let { count } = useSnapshot(testState);
    let arr = [];
    for (let i = 0; i < 100; i++) {
        arr.push(<div key={i}>{i}</div>);
    }
    return <div className=''>
        <div className='bg-warning position-sticky top-0'>
            <div className='container d-flex'>
                <div className='flex-fill'>Header</div>
                <div className=''>Header</div>
            </div>
        </div>
        <div className='bg-secondary'>
            <div className='container bg-white'>
                {vAbout}
                <div onClick={() => testState.count++}>count: {count}</div>
                <div onClick={() => setX(x + 1)}>x: {x}</div>

                <div><Link to={`/about`} className="btn btn-link">about</Link></div>
                <div><Link to={`/about/a`} className="btn btn-link">about/A</Link></div>
                <div><Link to={`/about/b`} className="btn btn-link">about/B</Link></div>
                {arr}
                {vAbout}
            </div>
        </div>
    </div>;
}

function B() {
    return <div>b</div>;
}
function HomeIndex() {
    return <div>HomeIndex</div>;
}

function Home() {
    function tabClassName({ isActive }: {
        isActive: boolean;
        isPending: boolean;
    }) {
        return 'btn flex-fill mx-1 ' +
            (isActive === true ? 'btn-primary' : 'btn-info');
    }
    let tabs = <div className="d-flex container">
        <NavLink to={`/`} className={tabClassName}>Home</NavLink>
        <NavLink to={`a`} className={tabClassName}>Aaaaaaaaaaaaa</NavLink>
        <NavLink to={`b`} className={tabClassName}>B</NavLink>
        <div className='w-1c'></div>
    </div>;

    return <div className='d-flex flex-column'>
        <div className='flex-fill'>
            <Outlet />
        </div>
        <div className='invisible'>
            {tabs}
        </div>
        <div className='bg-warning position-fixed bottom-0 w-100'>
            {tabs}
        </div>
    </div>;
}
function AboutIndex() {
    let arr = [];
    for (let i = 0; i < 100; i++) {
        arr.push(<div key={i}>{i}</div>);
    }
    return <div>
        <div>AboutIndex</div>
        {arr}
        <Link to="a">AboutA</Link>
        <Link to="../">&nbsp;back</Link>
        <ButtonBack />
    </div>
}
function AboutA() {
    const { state } = useLocation();
    return <div>
        AboutA()
        <div>{JSON.stringify(state)}</div>
    </div>
}
function AboutB() {
    let outletState = useOutletContext<State>();
    let state = useSnapshot(outletState.state);
    return <div>
        AboutB()
        <div onClick={() => { outletState.state.c += '1' }}>count in outlet: {state.c}</div>
    </div>;
}

function ButtonBack({ className, children }: { className?: string; children?: ReactNode; }) {
    const nav = useNavigate();
    return <div className={'btn btn-outline-primary ' + (className ?? '')} onClick={() => nav(-1)}>{children ?? '<'}</div>
}
class State {
    a = 1;
    b = 2;
    state = proxy({
        c: 'cccc',
    })
    constructor() {
        console.log('state');
    }

    async load() {
    }
}

function About() {
    const [count, setCount] = useState(0);
    const obj = useMemo(() => new State(), []);
    let state = useSnapshot(obj.state);
    return <div>
        about HHHH <ButtonBack />
        <div onClick={() => { obj.state.c += '1' }}>count in outlet: {state.c}</div>
        <div onClick={() => setCount(count + 1)}>count: {count}</div>
        <div><Link to={``} className="btn btn-link">about</Link></div>
        <div><Link to={`a`} state={obj} className="btn btn-link">about/A</Link></div>
        <div><Link to={`b`} className="btn btn-link">about/B</Link></div>
        <Outlet context={obj} />
    </div>;
}
export function MyUqAppView() {
    let { count } = useSnapshot(testState);
    // <AppRoutes />
    //<UqAppView uqApp={uqApp}>
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />}>
                <Route index element={<HomeIndex />} />
                <Route path="a" element={<A />} />
                <Route path="b" element={<B />} />
            </Route>
            <Route path="/about" element={<About />}>
                <Route index element={<AboutIndex />} />
                <Route path="a" element={<AboutA />} />
                <Route path="b" element={<AboutB />} />
            </Route>
        </Routes>
    </BrowserRouter>;
    // </UqAppView>
}

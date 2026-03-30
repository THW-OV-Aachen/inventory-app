import { useMemo, useEffect, type ComponentType } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import type { RootState } from '../../store/store';
import { setLastTopic, clearLastTopic } from '../../store/slices/guideSlice';
import {
    ArrowDownAZ,
    ArrowDownNarrowWide,
    ChevronLeft,
    ClipboardList,
    Download,
    FolderSync,
    MousePointerClick,
    Package,
    PlusCircle,
    Search,
    SquarePen,
    CheckCircle2,
    Upload,
    Plus,
    Wrench,
    ScanLine
} from 'lucide-react';

import { Card, Container } from '../../styles/components';
import { theme } from '../../styles/theme';

type GuideTopicId = 'find-item' | 'add-item' | 'inspect-item' | 'import-export' | 'packing-plans';

type GuideTopic = {
    id: GuideTopicId;
    title: string;
    description: string;
    icon: ComponentType<{ size?: number }>;
    available: boolean;
};

const Guide = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const lastTopicId = useSelector((state: RootState) => state.guide.lastTopicId);

    // If the user returns to the Guide base path and a last topic exists, redirect there.
    useEffect(() => {
        if (location.pathname === '/guide' && lastTopicId) {
            navigate(lastTopicId, { replace: true });
        }
    }, [location.pathname, lastTopicId, navigate]);

    return (
        <Routes>
            <Route index element={<GuideListScreen />} />
            <Route path="find-item" element={<FindItemGuideScreen />} />
            <Route path="add-item" element={<AddItemGuideScreen />} />
            <Route path="inspect-item" element={<InspectItemGuideScreen />} />
            <Route path="import-export" element={<ImportExportGuideScreen />} />
            <Route path="packing-plans" element={<PackingPlansGuideScreen />} />
        </Routes>
    );
};

const GuideListScreen = () => {
    const navigate = useNavigate();

    // Central list for the guide tiles and their availability in the UI.
    const topics = useMemo<GuideTopic[]>(
        () => [
            {
                id: 'find-item',
                title: 'Artikelsuche',
                description: 'Nutze Suche, Filtern, Sortieren und Scannen, um einen Artikel schnell zu finden.',
                icon: Search,
                available: true,
            },
            {
                id: 'add-item',
                title: 'Artikel hinzufügen',
                description: 'Einen neuen Inventareintrag erstellen.',
                icon: PlusCircle,
                available: true,
            },
            {
                id: 'inspect-item',
                title: 'Inspektion und Wartung',
                description: 'Überprüfe den Zustand deiner Artikel und aktualisiere das nächste Inspektionsdatum.',
                icon: Wrench,
                available: true,
            },
            {
                id: 'import-export',
                title: 'Import / Export',
                description: 'Importiere deine Daten aus Excel oder exportiere den Stand deines Inventars.',
                icon: FolderSync,
                available: true,
            },
            {
                id: 'packing-plans',
                title: 'Packpläne',
                description: 'Den nächsten Einsatz optimal vorbereiten.',
                icon: ClipboardList,
                available: true,
            },
        ],
        []
    );

    return (
        <div>
            <StyledContainer $maxWidth="960px">
                <IntroCard>
                    <IntroTitle>Funktionsübersicht</IntroTitle>
                    <IntroText>
                        Hier findest du eine Übersicht über die verschiedenen Funktionen der Inventar-App.
                    </IntroText>

                    <TopicGrid>
                        {topics.map((t) => {
                            const Icon = t.icon;
                            const dispatch = useDispatch();
                            const onClick = () => {
                                if (!t.available) return;
                                dispatch(setLastTopic(t.id));
                                navigate(t.id);
                            };

                            return (
                                <TopicButton
                                    key={t.id}
                                    type="button"
                                    onClick={onClick}
                                    disabled={!t.available}
                                    $available={t.available}
                                >
                                    <TopicHeader>
                                        <TopicIcon>
                                            <Icon size={18} />
                                        </TopicIcon>
                                        <TopicTitleRow>
                                            <TopicTitle>{t.title}</TopicTitle>
                                        </TopicTitleRow>
                                    </TopicHeader>
                                    <TopicDescription>{t.description}</TopicDescription>
                                    {!t.available && (
                                        <TopicUnavailableHint>Anleitung noch nicht verfügbar</TopicUnavailableHint>
                                    )}
                                </TopicButton>
                            );
                        })}
                    </TopicGrid>
                </IntroCard>
            </StyledContainer>
        </div>
    );
};

const FindItemGuideScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBack = () => {
        dispatch(clearLastTopic());
        navigate('/guide');
    };

    return (
        <div>
            <StyledContainer $maxWidth="960px">
                <DetailHeader>
                    <BackToGuidesButton type="button" onClick={handleBack}>
                        <ChevronLeft size={18} />
                        <span>Guides</span>
                    </BackToGuidesButton>
                </DetailHeader>

                <TaskCard $withLeftBorder $leftBorderColor={theme.colors.primary}>
                    <TaskHeader>
                        <TaskTitle>
                            <span>Artikelsuche</span>
                        </TaskTitle>
                        <TaskSubtitle>
                            Nutze Suche, Filtern, Sortieren und Scannen, um einen Artikel schnell zu finden, und klicke ihn anschließend an, um die Details zu öffnen.
                        </TaskSubtitle>
                    </TaskHeader>

                    <FindItemTaskGrid>
                        <FindItemSteps>
                            <FindItemStep>
                                <StepIcon>
                                    <Package size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Artikelübersicht öffnen</StepTitle>
                                    <StepText>Öffne über die Navigationsleiste das Inventar.</StepText>
                                </div>
                            </FindItemStep>

                            <FindItemStep>
                                <StepIcon>
                                    <Search size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Suchen</StepTitle>
                                    <StepText>
                                        Gib ein, was du weißt (z. B. Name, Sachnummer, Inventarnummer), um die Liste
                                        einzugrenzen.
                                    </StepText>
                                </div>
                            </FindItemStep>

                            <FindItemStep>
                                <StepIcon>
                                    <ArrowDownNarrowWide size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Filtern</StepTitle>
                                    <StepText>
                                        Über das Dropdown-Menü neben der Suchleiste kannst du die Ergebnisse filtern. Labelfilter werden dabei UND-verknüpft.
                                    </StepText>
                                </div>
                            </FindItemStep>

                            <FindItemStep>
                                <StepIcon>
                                    <ArrowDownAZ size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Sortieren</StepTitle>
                                    <StepText>
                                        Klicke auf eine Spaltenüberschrift (z. B. Inventar-Nr., Name, Standort), um
                                        die Liste zu sortieren. Ein erneuter Klick kehrt die Sortierreihenfolge um. Ebenso kannst du die Sortierreihenfolge über das Dropdown-Menü ändern.
                                    </StepText>
                                </div>
                            </FindItemStep>

                            <FindItemStep>
                                <StepIcon>
                                    <ScanLine size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Scannen</StepTitle>
                                    <StepText>
                                        Klicke auf das Scan-Symbol, um den Barcode-Scanner zu öffnen. Scanne den Barcode eines Artikels, um den entsprechenden Artikel zu finden.
                                    </StepText>
                                </div>
                            </FindItemStep>
                        </FindItemSteps>
                    </FindItemTaskGrid>
                </TaskCard>
            </StyledContainer>
        </div>
    );
};

const AddItemGuideScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBack = () => {
        dispatch(clearLastTopic());
        navigate('/guide');
    };

    return (
        <div>
            <StyledContainer $maxWidth="960px">
                <DetailHeader>
                    <BackToGuidesButton type="button" onClick={handleBack}>
                        <ChevronLeft size={18} />
                        <span>Guides</span>
                    </BackToGuidesButton>
                </DetailHeader>

                <TaskCard $withLeftBorder $leftBorderColor={theme.colors.primary}>
                    <TaskHeader>
                        <TaskTitle>
                            <span>Neuen Artikel hinzufügen</span>
                        </TaskTitle>
                        <TaskSubtitle>
                            
                        </TaskSubtitle>
                    </TaskHeader>

                    <AddItemTaskGrid>
                        <AddItemSteps>
                            <AddItemStep>
                                <StepIcon>
                                    <PlusCircle size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Neuen Artikel anlegen</StepTitle>
                                    <StepText>Öffne über das Symbol <Package size={16} /> in der Navigationsleiste die Artikelübersicht und füge einen neuen Artikel über den Plus-Button in der oberen rechten Ecke hinzu.</StepText>
                                </div>
                            </AddItemStep>

                            <AddItemStep>
                                <StepIcon>
                                    <SquarePen size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Felder ausfüllen</StepTitle>
                                    <StepText>
                                        <strong>Pflichtfelder</strong> sind durch einen roten Stern gekennzeichnet. Die verbleibenden Felder sind optional.
                                    </StepText>
                                </div>
                            </AddItemStep>

                            <AddItemStep>
                                <StepIcon>
                                    <CheckCircle2 size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Speichern</StepTitle>
                                    <StepText>  
                                        Klicke auf <strong>Hinzufügen</strong>, um den Artikel zu speichern.
                                    </StepText>
                                </div>
                            </AddItemStep>
                        </AddItemSteps>
                    </AddItemTaskGrid>
                </TaskCard>
            </StyledContainer>
        </div>
    );
};

const InspectItemGuideScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBack = () => {
        dispatch(clearLastTopic());
        navigate('/guide');
    };

    return (
        <div>
            <StyledContainer $maxWidth="960px">
                <DetailHeader>
                    <BackToGuidesButton type="button" onClick={handleBack}>
                        <ChevronLeft size={18} />
                        <span>Guides</span>
                    </BackToGuidesButton>
                </DetailHeader>

                <TaskCard $withLeftBorder $leftBorderColor={theme.colors.primary}>
                    <TaskHeader>
                        <TaskTitle>
                            <span>Inspektion und Wartung</span>
                        </TaskTitle>
                        <TaskSubtitle>
                            

                        </TaskSubtitle>
                    </TaskHeader>

                    <InspectItemTaskGrid>
                        <InspectItemSteps>
                            <InspectItemStep>
                                <StepIcon>
                                    <SquarePen size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Wartungsattribute pflegen</StepTitle>
                                    <StepText>Wenn du deine Artikel regelmäßig inspizieren möchtest, kannst du in den Artikeldetails die Attribute <strong>Schadenszustand</strong>, <strong>Letzte Inspektion</strong> und <strong>Inspektionsintervall</strong> pflegen.</StepText>
                                </div>
                            </InspectItemStep>

                            <InspectItemStep>
                                <StepIcon>
                                    <ArrowDownNarrowWide size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Nach nächsten Inspektionsterminen sortieren</StepTitle>
                                    <StepText>Um den Zustand deiner Artikel vor dem nächsten Inspektionstermin zu überprüfen, kannst du in der Artikelübersicht nach <strong>Nächste Inspektion</strong> sortieren. Ist das Datum rot hervorgehoben, liegt es in der Vergangenheit und die Inspektion ist besonders dringlich.</StepText>
                                </div>
                            </InspectItemStep>

                            <InspectItemStep>
                                <StepIcon>
                                    <CheckCircle2 size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Inspektion abschließen</StepTitle>
                                    <StepText>Aktualisiere die Schadensstufe und füge bei Bedarf Kommentare zu Mängeln hinzu. Setze das Datum der letzten Inspektion auf das heutige Datum. Das nächste Inspektionsdatum wird automatisch aus dem eingestellten Inspektionsintervall berechnet.</StepText>
                                </div>
                            </InspectItemStep>
                        </InspectItemSteps>
                    </InspectItemTaskGrid>
                </TaskCard>
            </StyledContainer>
        </div>
    );
};

const ImportExportGuideScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBack = () => {
        dispatch(clearLastTopic());
        navigate('/guide');
    };

    return (
        <div>
            <StyledContainer $maxWidth="960px">
                <DetailHeader>
                    <BackToGuidesButton type="button" onClick={handleBack}>
                        <ChevronLeft size={18} />
                        <span>Guides</span>
                    </BackToGuidesButton>
                </DetailHeader>

                <TaskCard $withLeftBorder $leftBorderColor={theme.colors.primary}>
                    <TaskHeader>
                        <TaskTitle>
                            <span>Import/Export</span>
                        </TaskTitle>
                        <TaskSubtitle>
                            Öffne über das Symbol <FolderSync size={16} /> in der Navigationsleiste den Bereich Import/Export.
                            Hier kannst du eine bereits vorhandene Excel-Datei importieren oder den aktuellen Stand des Inventars als Excel-Datei exportieren.
                        </TaskSubtitle>
                    </TaskHeader>

                    <ImportExportTaskGrid>
                        <ImportExportStep>
                            <StepTitle>
                                Import
                            </StepTitle> 
                        </ImportExportStep>
                        <ImportExportStep>
                                <StepIcon>
                                    <MousePointerClick size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Excel-Datei auswählen</StepTitle>
                                    <StepText>
                                        Klicke auf <strong>Durchsuchen</strong> und wähle eine Excel-Datei (
                                        <code>.xlsx</code>, <code>.xls</code> oder <code>.csv</code>). Achte darauf, dass im vom Exportformat abweichende Importdateien die Spalten folgendermaßen bezeichnet sind: 
                                        <ul>
                                            <li>Ebene</li>
                                            <li>OE</li>
                                            <li>Art</li>
                                            <li>FB</li>
                                            <li>Menge</li>
                                            <li>Menge Ist</li>
                                            <li>Verfügbar</li>
                                            <li>Ort</li>
                                            <li>Ausstattung | Hersteller | Typ </li>
                                            <li>Sachnummer</li>
                                            <li>Inventar Nr</li>
                                            <li>Gerätenr.</li>
                                            <li>Status</li>
                                            <li>Bemerkung</li>
                                        </ul>
                                        Andersnamige Spalten werden ignoriert. Die Spalten <i>Ausstattung | Hersteller | Typ</i> und <i>Sachnummer</i> müssen vorhanden sein. 
                                    </StepText>
                                </div>
                            </ImportExportStep>
                            <ImportExportStep>
                                <StepIcon>
                                    <Upload size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Import starten</StepTitle>
                                    <StepText>
                                        Klicke auf <strong>Importieren</strong>. Der Fortschritt wird angezeigt,
                                        während der Import läuft.
                                    </StepText>
                                </div>
                            </ImportExportStep>

                        <ImportExportStep>
                            <StepTitle>
                                Export
                            </StepTitle> 
                        </ImportExportStep>
                        <ImportExportSteps>
                            <ImportExportStep>
                                <StepIcon>
                                    <Download size={16} />
                                </StepIcon>
                                <div>
                                    <StepText>
                                        Klicke auf <strong>Exportieren</strong>, um vor größeren Änderungen ein{' '}
                                        <code>.xlsx</code>-Backup herunterzuladen. 
                                    </StepText>
                                </div>
                            </ImportExportStep>
                        </ImportExportSteps>
                    </ImportExportTaskGrid>
                </TaskCard>
            </StyledContainer>
        </div>
    );
};

const PackingPlansGuideScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBack = () => {
        dispatch(clearLastTopic());
        navigate('/guide');
    };

    return (
        <div>
            <StyledContainer $maxWidth="960px">
                <DetailHeader>
                    <BackToGuidesButton type="button" onClick={handleBack}>
                        <ChevronLeft size={18} />
                        <span>Guides</span>
                    </BackToGuidesButton>
                </DetailHeader>

                <TaskCard $withLeftBorder $leftBorderColor={theme.colors.primary}>
                    <TaskHeader>
                        <TaskTitle>
                            <span>Packpläne</span>
                        </TaskTitle>
                        <TaskSubtitle>
                            Ein Packplan ist eine Liste von Artikeln, die für einen bestimmten Einsatz zusammengestellt werden.
                            Er kann aus der Übersicht der Packpläne (Symbol <ClipboardList size={16} /> in der Navigationsleiste) oder direkt aus der Inventarliste erstellt werden. 
 
                        </TaskSubtitle>
                    </TaskHeader>

                    <PackingPlansTaskGrid>
                        <PackingPlansSteps>
                            <PackingPlansStep>
                                <StepTitle>Packplan aus der Inventarliste erstellen</StepTitle>
                            </PackingPlansStep>
                            <PackingPlansStep>
                                <StepIcon>
                                    <Package size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>„Inventar“ öffnen</StepTitle>
                                    <StepText>Öffne über die Sidebar-Navigation die Inventarliste.</StepText>
                                </div>
                            </PackingPlansStep>

                            <PackingPlansStep>
                                <StepIcon>
                                    <Package size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>„Pack“-Modus aktivieren</StepTitle>
                                    <StepText>
                                        Klicke in der oberen Leiste auf <strong>Packen</strong>. Die UI wechselt in
                                        den Auswahlmodus. Auch hier kannst du die Suchleiste und die Filter nutzen, um die Artikel zu finden, die du für den Packplan verwenden möchtest.
                                    </StepText>
                                </div>
                            </PackingPlansStep>

                            <PackingPlansStep>
                                <StepIcon>
                                    <MousePointerClick size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Artikel auswählen</StepTitle>
                                    <StepText>
                                        Klicke Artikelzeilen/-karten an, um sie für den Plan auszuwählen. Du kannst auch alle Artikel auf einmal auswählen, indem du auf "Alle auswählen" klickst. Dadurch werden alle Artikel, die den aktuellen Filtern entsprechen, ausgewählt. Wenn du "Alle abwählen" klickst, werden alle Artikel wieder abgewählt.
                                    </StepText>
                                </div>
                            </PackingPlansStep>

                            <PackingPlansStep>
                                <StepIcon>
                                    <ArrowDownNarrowWide size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Mengen festlegen</StepTitle>
                                    <StepText>
                                        Nutze die Mengensteuerung, um die{' '}
                                        <strong>benötigte Menge</strong> pro ausgewähltem Artikel zu setzen. Überschreitet die Menge die verfügbare Menge, wird dir in den Packplan-Details eine Warnung angezeigt.
                                    </StepText>
                                </div>
                            </PackingPlansStep>

                            <PackingPlansStep>
                                <StepIcon>
                                    <SquarePen size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Plan benennen</StepTitle>
                                    <StepText>
                                        Trage im Feld <strong>Packplan-…</strong> einen Namen ein und wähle ein Szenario über das Dropdown-Menü.
                                    </StepText>
                                </div>
                            </PackingPlansStep>

                            <PackingPlansStep>
                                <StepIcon>
                                    <CheckCircle2 size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Speichern</StepTitle>
                                    <StepText>
                                        Klicke auf <strong>Speichern</strong>. Die App erstellt den Packplan und öffnet die
                                        Detailseite.
                                    </StepText>
                                </div>
                            </PackingPlansStep>
                            <PackingPlansStep>
                                <StepTitle>Die Packplan-Übersicht</StepTitle>
                            </PackingPlansStep>
                            <PackingPlansStep>
                                Die Packplan-Übersicht befindet sich unter dem Listensymbol in dem Navigationsmenü. Sie zeigt alle Packpläne, die du erstellt hast. Wenn du begonnen hast, einen Packplan zu packen, wird dieser Packplan in der Übersicht als "angefangen" markiert. Wenn du den Packplan fertig gepackt hast, wird dieser als "gepackt" markiert. 
                            </PackingPlansStep>
                            <PackingPlansStep>
                                <StepIcon>
                                    <Plus size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Neuen Packplan erstellen</StepTitle>
                                    <StepText>
                                        Auch aus der Packplan-Übersicht kannst du einen neuen Packplan erstellen. Klicke dazu auf das Plus-Symbol in der oberen rechten Ecke.
                                    </StepText>
                                </div>
                            </PackingPlansStep>
                            <PackingPlansStep>
                                <StepIcon>
                                    <MousePointerClick size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Gespeicherten Plan öffnen</StepTitle>
                                    <StepText>
                                        Klicke in der Übersicht auf einen gespeicherten Plan, um ihn zu öffnen. Hier kannst du den Packplan bearbeiten, Notizen zum Plan und zu den einzelnen Artikeln hinzufügen, die Artikelliste und -reihenfolge ändern oder den Packplan löschen.
                                        Auch kannst du Artikel "einpacken" und damit die Übersicht darüber behalten, welche Artikel schon ins Fahrzeug geladen sind. In der Übersicht der Packpläne siehst du dann, welche Pläne du schon angefangen hast zu packen und welche du schon fertig gepackt hast.
                                    </StepText>
                                </div>
                            </PackingPlansStep>
                        </PackingPlansSteps>
                    </PackingPlansTaskGrid>
                </TaskCard>
            </StyledContainer>
        </div>
    );
};

const StyledContainer = styled(Container)`
    padding: 0 ${theme.spacing.xl} ${theme.spacing.xxl};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xl};
`;

const IntroCard = styled(Card)`
    padding: ${theme.spacing.xl};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
`;

const IntroTitle = styled.h3`
    margin: 0;
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
`;

const IntroText = styled.p`
    margin: 0;
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.base};
`;

const DetailHeader = styled.div`
    margin-bottom: ${theme.spacing.md};
`;

const BackToGuidesButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    background: transparent;
    padding: 6px 0;
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.medium};
    cursor: pointer;

    &:hover {
        color: ${theme.colors.primary};
    }
`;

const TopicGrid = styled.div`
    margin-top: ${theme.spacing.sm};
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${theme.spacing.md};

    @media (max-width: ${theme.breakpoints.md}) {
        grid-template-columns: 1fr;
    }
`;

const TopicButton = styled.button<{ $available: boolean }>`
    text-align: left;
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid ${theme.colors.border.default};
    background: ${theme.colors.background.white};
    padding: ${theme.spacing.lg};
    box-shadow: ${theme.shadows.sm};
    cursor: ${({ $available }) => ($available ? 'pointer' : 'not-allowed')};
    opacity: ${({ $available }) => ($available ? 1 : 0.65)};
    transition: ${theme.transitions.default};

    &:hover {
        transform: ${({ $available }) => ($available ? 'translateY(-1px)' : 'none')};
        box-shadow: ${({ $available }) => ($available ? theme.shadows.md : theme.shadows.sm)};
        border-color: ${({ $available }) => ($available ? theme.colors.primary : theme.colors.border.default)};
    }

    &:disabled {
        cursor: not-allowed;
    }
`;

const TopicHeader = styled.div`
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.sm};
`;

const TopicIcon = styled.div`
    width: 36px;
    height: 36px;
    border-radius: ${theme.borderRadius.lg};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.background.light};
    border: 1px solid ${theme.colors.border.default};
    color: ${theme.colors.text.secondary};
    flex-shrink: 0;
`;

const TopicTitleRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing.sm};
    width: 100%;
`;

const TopicTitle = styled.div`
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize.md};
`;

const TopicDescription = styled.div`
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSize.base};
    line-height: 1.5;
`;

const TopicUnavailableHint = styled.div`
    margin-top: ${theme.spacing.sm};
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.sm};
`;

const TaskCard = styled(Card)`
    padding: ${theme.spacing.xl};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xl};
`;

const TaskHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
`;

const TaskTitle = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeight.semibold};
    font-size: ${theme.typography.fontSize.lg};
`;

const TaskSubtitle = styled.p`
    margin: 0;
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.base};
`;

const TaskGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xl};
    max-width: 800px;
`;

const Steps = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
`;

const Step = styled.div`
    display: flex;
    gap: ${theme.spacing.md};
    align-items: flex-start;
`;

// Desktop-only layout polish for the Find-Item guide (mobile stays unchanged)
const FindItemTaskGrid = styled(TaskGrid)``;

const FindItemSteps = styled(Steps)``;

const FindItemStep = styled(Step)``;

// Desktop-only layout polish for the Add-Item guide (mobile stays unchanged)
const AddItemTaskGrid = styled(TaskGrid)``;

const AddItemSteps = styled(Steps)``;

const AddItemStep = styled(Step)``;

// Desktop-only layout polish for the Import/Export guide (mobile stays unchanged)
const ImportExportTaskGrid = styled(TaskGrid)``;

const ImportExportSteps = styled(Steps)``;

const ImportExportStep = styled(Step)``;

// Desktop-only layout polish for the Packing Plans guide (mobile stays unchanged)
const PackingPlansTaskGrid = styled(TaskGrid)``;

const PackingPlansSteps = styled(Steps)``;

const PackingPlansStep = styled(Step)``;

const StepIcon = styled.div`
    width: 32px;
    height: 32px;
    border-radius: ${theme.borderRadius.lg};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.background.light};
    border: 1px solid ${theme.colors.border.default};
    color: ${theme.colors.text.secondary};
    flex-shrink: 0;
`;

const StepTitle = styled.div`
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin-bottom: 2px;
`;

const StepText = styled.div`
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSize.base};
    line-height: 1.5;
`;

// Desktop-only layout polish for the Inspect-Item guide (mobile stays unchanged)
const InspectItemTaskGrid = styled(TaskGrid)``;

const InspectItemSteps = styled(Steps)``;

const InspectItemStep = styled(Step)``;

export default Guide;

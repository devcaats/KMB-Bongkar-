import React from "react";

// Helper untuk membuat pembungkus SVG agar bisa menerima className seperti komponen biasa
const createIcon = (src) => {
    return ({ className = "size-5", ...props }) => (
        <img src={src} className={className} alt="icon" {...props} />
    );
};

// Import semua aset SVG standar Vite Laravel
import plusSvg from "./plus.svg";
import closeSvg from "./close.svg";
import boxSvg from "./box.svg";
import checkCircleSvg from "./check-circle.svg";
import alertSvg from "./alert.svg";
import infoSvg from "./info.svg";
import infoErrorSvg from "./info-error.svg";
import boltSvg from "./bolt.svg";
import arrowUpSvg from "./arrow-up.svg";
import arrowDownSvg from "./arrow-down.svg";
import folderSvg from "./folder.svg";
import videosSvg from "./videos.svg";
import audioSvg from "./audio.svg";
import gridSvg from "./grid.svg";
import fileSvg from "./file.svg";
import downloadSvg from "./download.svg";
import arrowRightSvg from "./arrow-right.svg";
import groupSvg from "./group.svg";
import boxLineSvg from "./box-line.svg";
import shootingStarSvg from "./shooting-star.svg";
import dollarLineSvg from "./dollar-line.svg";
import trashSvg from "./trash.svg";
import angleUpSvg from "./angle-up.svg";
import angleDownSvg from "./angle-down.svg";
import angleLeftSvg from "./angle-left.svg";
import angleRightSvg from "./angle-right.svg";
import pencilSvg from "./pencil.svg";
import checkLineSvg from "./check-line.svg";
import closeLineSvg from "./close-line.svg";
import chevronDownSvg from "./chevron-down.svg";
import chevronUpSvg from "./chevron-up.svg";
import paperPlaneSvg from "./paper-plane.svg";
import lockSvg from "./lock.svg";
import envelopeSvg from "./envelope.svg";
import userLineSvg from "./user-line.svg";
import calenderLineSvg from "./calender-line.svg";
import eyeSvg from "./eye.svg";
import eyeCloseSvg from "./eye-close.svg";
import timeSvg from "./time.svg";
import copySvg from "./copy.svg";
import chevronLeftSvg from "./chevron-left.svg";
import userCircleSvg from "./user-circle.svg";
import taskIconSvg from "./task-icon.svg";
import listSvg from "./list.svg";
import tableSvg from "./table.svg";
import pageSvg from "./page.svg";
import pieChartSvg from "./pie-chart.svg";
import boxCubeSvg from "./box-cube.svg";
import plugInSvg from "./plug-in.svg";
import docsSvg from "./docs.svg";
import mailLineSvg from "./mail-line.svg";
import horizontalDotsSvg from "./horizontal-dots.svg";
import chatSvg from "./chat.svg";
import moredotSvg from "./moredot.svg";
import alertHexaSvg from "./alert-hexa.svg";
import infoHexaSvg from "./info-hexa.svg";

// Bungkus menjadi Komponen React
const PlusIcon = createIcon(plusSvg);
const CloseIcon = createIcon(closeSvg);
const BoxIcon = createIcon(boxSvg);
const CheckCircleIcon = createIcon(checkCircleSvg);
const AlertIcon = createIcon(alertSvg);
const InfoIcon = createIcon(infoSvg);
const ErrorIcon = createIcon(infoErrorSvg);
const BoltIcon = createIcon(boltSvg);
const ArrowUpIcon = createIcon(arrowUpSvg);
const ArrowDownIcon = createIcon(arrowDownSvg);
const FolderIcon = createIcon(folderSvg);
const VideoIcon = createIcon(videosSvg);
const AudioIcon = createIcon(audioSvg);
const GridIcon = createIcon(gridSvg);
const FileIcon = createIcon(fileSvg);
const DownloadIcon = createIcon(downloadSvg);
const ArrowRightIcon = createIcon(arrowRightSvg);
const GroupIcon = createIcon(groupSvg);
const BoxIconLine = createIcon(boxLineSvg);
const ShootingStarIcon = createIcon(shootingStarSvg);
const DollarLineIcon = createIcon(dollarLineSvg);
const TrashBinIcon = createIcon(trashSvg);
const AngleUpIcon = createIcon(angleUpSvg);
const AngleDownIcon = createIcon(angleDownSvg);
const AngleLeftIcon = createIcon(angleLeftSvg);
const AngleRightIcon = createIcon(angleRightSvg);
const PencilIcon = createIcon(pencilSvg);
const CheckLineIcon = createIcon(checkLineSvg);
const CloseLineIcon = createIcon(closeLineSvg);
const ChevronDownIcon = createIcon(chevronDownSvg);
const ChevronUpIcon = createIcon(chevronUpSvg);
const PaperPlaneIcon = createIcon(paperPlaneSvg);
const LockIcon = createIcon(lockSvg);
const EnvelopeIcon = createIcon(envelopeSvg);
const UserIcon = createIcon(userLineSvg);
const CalenderIcon = createIcon(calenderLineSvg);
const EyeIcon = createIcon(eyeSvg);
const EyeCloseIcon = createIcon(eyeCloseSvg);
const TimeIcon = createIcon(timeSvg);
const CopyIcon = createIcon(copySvg);
const ChevronLeftIcon = createIcon(chevronLeftSvg);
const UserCircleIcon = createIcon(userCircleSvg);
const TaskIcon = createIcon(taskIconSvg);
const ListIcon = createIcon(listSvg);
const TableIcon = createIcon(tableSvg);
const PageIcon = createIcon(pageSvg);
const PieChartIcon = createIcon(pieChartSvg);
const BoxCubeIcon = createIcon(boxCubeSvg);
const PlugInIcon = createIcon(plugInSvg);
const DocsIcon = createIcon(docsSvg);
const MailIcon = createIcon(mailLineSvg);
const HorizontaLDots = createIcon(horizontalDotsSvg);
const ChatIcon = createIcon(chatSvg);
const MoreDotIcon = createIcon(moredotSvg);
const AlertHexaIcon = createIcon(alertHexaSvg);
const ErrorHexaIcon = createIcon(infoHexaSvg);

export {
    ErrorHexaIcon,
    AlertHexaIcon,
    MoreDotIcon,
    DownloadIcon,
    FileIcon,
    GridIcon,
    AudioIcon,
    VideoIcon,
    BoltIcon,
    PlusIcon,
    BoxIcon,
    CloseIcon,
    CheckCircleIcon,
    AlertIcon,
    InfoIcon,
    ErrorIcon,
    ArrowUpIcon,
    FolderIcon,
    ArrowDownIcon,
    ArrowRightIcon,
    GroupIcon,
    BoxIconLine,
    ShootingStarIcon,
    DollarLineIcon,
    TrashBinIcon,
    AngleUpIcon,
    AngleDownIcon,
    PencilIcon,
    CheckLineIcon,
    CloseLineIcon,
    ChevronDownIcon,
    PaperPlaneIcon,
    EnvelopeIcon,
    LockIcon,
    UserIcon,
    CalenderIcon,
    EyeIcon,
    EyeCloseIcon,
    TimeIcon,
    CopyIcon,
    ChevronLeftIcon,
    UserCircleIcon,
    TaskIcon,
    ListIcon,
    TableIcon,
    PageIcon,
    PieChartIcon,
    BoxCubeIcon,
    PlugInIcon,
    DocsIcon,
    MailIcon,
    HorizontaLDots,
    ChevronUpIcon,
    ChatIcon,
    AngleLeftIcon,
    AngleRightIcon,
};

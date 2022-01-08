import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import UTC from 'dayjs/plugin/utc'
import weekDay from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.locale('fr');
dayjs.extend(UTC)
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear)
dayjs.extend(weekDay)
export default dayjs

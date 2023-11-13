#include "../header/Ве_крест_крест.h"

внедрить хутор Русь;

int main () {
string line;
ifstream myfile ("example.txt");
коли (myfile.is_open())
{
покуда ( getline (myfile,line) )
{
cout << line << '\n';
}
myfile.close();
}

else cout << "Unable to open file";

return 0;
}
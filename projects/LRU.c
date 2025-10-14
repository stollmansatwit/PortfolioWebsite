#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <time.h>
#include <limits.h>
#include <string.h>

int replacements = 0;
void pageReplacementInitialization(int arr[], int **pages, int pageFault[], int size, int num_pages) 
{
    // Initialize pages for the first num_pages elements of arr
    for (int i = 0; i < num_pages && i < size; i++) 
    {
        // Initialize pages
        for (int j = i; j < size; j++) 
        {
            pages[i][j] = arr[i];
        }
        pageFault[i] = 1;
    }
}

void pageReplacementAlgorithm(int arr[], int **pages, int pageFault[], int size, int num_pages)
{
    int *distances = (int *)calloc(num_pages, sizeof(int));  // Array to store distances for each page
    
    for (int i = num_pages; i < size; i++)
    {
        // Check if current value exists in any page
        int fault = 1;  // Assume page fault until proven otherwise
        for (int p = 0; p < num_pages; p++)
        {
            if (arr[i] == pages[p][i])
            {
                fault = 0;
                break;
            }
        }

        if (fault)
        {
            pageFault[i] = 1;
            // Reset all distances
            for (int p = 0; p < num_pages; p++)
            {
                distances[p] = 0;
            }

            // Calculate distances for each page
            for (int j = i-1; j >= 0; j--)
            {
                for (int p = 0; p < num_pages; p++)
                {
                    if (arr[j] == pages[p][j] && distances[p] == 0)
                    {
                        distances[p] = i-j;  // Distance from current to previous
                    }
                }
            }

            // Find page with maximum distance
            int max_distance = -1;
            int page_to_replace = 0;
            for (int p = 0; p < num_pages; p++)
            {
                if (distances[p] >= max_distance)
                {
                    max_distance = distances[p];
                    page_to_replace = p;
                }
            }

            // Replace the page with maximum distance
            replacements++;
            // Update the chosen page with new value
            for (int k = i; k < size; k++)
            {
                pages[page_to_replace][k] = arr[i];
                
            }
            
            // Keep other pages' values the same
            for (int p = 0; p < num_pages; p++)
            {
                if (p != page_to_replace)
                {
                    pages[p][i] = pages[p][i-1];
                }
            }
        }
        else
        {
            // No page fault, keep all current values
            for (int p = 0; p < num_pages; p++)
            {
                pages[p][i] = pages[p][i-1];
            }
        }
    }
    
    free(distances);
}
void printArray(int arr[], int size)
{
    for (int i = 0; i < size; i++)
    {
        printf("%d|", arr[i]);
    }
    printf("\n");
}
void print2dArray(int *arr, int size){
        for (int i = 0; i < size; i++)
    {
        printf("%d|", arr[i]);
    }
    printf("\n");
}
void placeHolder(char *c, int size){
    for (int i = 0; i < size; i++)
    {
        printf(" %s", c);
    }
}
int countPageFaults(int pageFault[], int size)
{
    // loop through pagefault array to count number of pagefaults
    // 0 means no pagefault
    // 1 means pagefault
    int sum = 0;
    for (int i = 0; i < size; i++)
    {
        if (pageFault[i] == 1)
        {
            sum += 1;
        }
    }
    return sum;
}

int main() {
    int *arr, *pageFault;
    int **pages;  // Array of pointers to hold multiple pages
    int size, num_pages;
    char input[1000];
    
    // Get size from user
    // printf("Enter size: ");
    // scanf("%d", &size);
    

    
    // Get reference string
    printf("Enter reference string(separated by spaces): ");
    fgets(input, sizeof(input), stdin);

    
    // Use strtok to parse the string
    char *token = strtok(input, " \n");
    int i = 0;

        // Get number of pages from user
    printf("Enter number of pages: ");
    scanf("%d", &num_pages);
    getchar();  // consume the newline

    //Avoid segmentation fault
    while(num_pages<=0){
        printf("Number of pages must be 1 or larger \n");
        printf("Enter number of pages: ");
        scanf("%d", &num_pages);
        getchar();  // consume the newline
    }
    
    // Dynamic allocation for reference string array
    arr = (int *)calloc(size, sizeof(int));
    pageFault = (int *)calloc(size, sizeof(int));
    
    // Allocate array of pointers for pages
    pages = (int **)malloc(num_pages * sizeof(int*));
    
    // Allocate memory for each page
    for(int i = 0; i < num_pages; i++) {
        pages[i] = (int *)malloc(size * sizeof(int));
        if (pages[i] == NULL) {
            printf("Memory allocation failed for page %d\n", i);
            return EXIT_FAILURE;
        }
    }
    
    while (token != NULL && i < size) {
        arr[i] = atoi(token);
        i++;
        token = strtok(NULL, " \n");
    }
    size = i;
    
    // Check if allocation was successful and print array
    if (arr == NULL) {
        return EXIT_FAILURE;
    }
    else {
        pageReplacementInitialization(arr, pages, pageFault, size, num_pages);
        pageReplacementAlgorithm(arr, pages, pageFault, size, num_pages);
        // print arrays
        printf("\n\t Reference String:\t");
        printArray(arr, size);
        printf("\t\t\t\t");

        placeHolder("|", size);
        printf("\n\t LRU Output");
        printf("\t\t");
        placeHolder("|", size);
        printf("\n");
        for(int i = 1; i < num_pages+1; i++){
            printf("\t Page %d:          \t", i);
            print2dArray(pages[i-1], size);
        }
        printf("\n");
        printf("\t Page faults:     \t");
        printArray(pageFault, size);
        printf("\n\t\t\t The number of page faults = %d\n", countPageFaults(pageFault, size));
        printf("\t\t\t The number of replacements = %d\n\n", replacements);
        
    }
    
    // Free all allocated memory
    free(arr);
    
    // Free each page
    for(int i = 0; i < num_pages; i++) {
        free(pages[i]);
    }
    // Free the array of pointers
    free(pages);
    
    return 0;
}
